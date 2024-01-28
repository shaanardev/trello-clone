import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { GenerateCardDescriptionSchema } from "@/lib/validators/generate-card-description";
import { db } from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";
import { hasReachedMaximumTokens, incrementAvailableAITokens } from "@/lib/org-limit/ai-tokens-limit";
import { openai } from "@/lib/openai";
import { ratelimits } from "@/lib/rate-limiters";

export const POST = async (req: NextRequest) => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const isPro = await checkSubscription();

    const ip = req.ip ?? '127.0.0.1';
    const limiter = isPro ? ratelimits.paid : ratelimits.free;
    const { success } = await limiter.limit(ip);
    if (!success) {
        return new NextResponse('Too Many Requests', { status: 429 });
    };

    const canGenerateDescription = await hasReachedMaximumTokens();

    if (!canGenerateDescription && !isPro) {
        console.log("Free limit reached");
        return new NextResponse("Bad Request", { status: 400 });
    }

    const body = await req.json();
    const validated = GenerateCardDescriptionSchema.safeParse(body);

    if (!validated.success) {
        return new NextResponse(`Bad Request - ${validated.error.flatten().fieldErrors}`, { status: 400 });
    }

    const safeData = validated.data;

    const card = await db.boardCard.findUnique({
        where: {
            id: safeData.cardId,
            boardList: {
                board: {
                    orgId
                }
            }
        },
        include: {
            boardList: {
                include: {
                    board: true
                }
            }
        }
    });

    if (!card) {
        return new NextResponse("Not Fund", { status: 404 });
    }

    if (!isPro) {
        await incrementAvailableAITokens();
    }

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        temperature: 0,
        messages: [
            {
                role: 'system',
                content:
                    'Using the following title/name of a task, generate  a short concise description between 50 to 100 words.',
            },
            {
                role: 'user',
                content: `Using the following title/name of a task, generate  a short concise description between 50 to 100 words.
                \n----------------\n
                CONTEXT:
                Task title/name is ${card.title}
                `
            }
        ],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}