import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { GenerateCardDescriptionSchema } from "@/lib/validators/generate-card-description";
import { db } from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";
import { incrementAvailableAITokens } from "@/lib/org/ai-tokens-limit";
import { openai } from "@/lib/openai";

export const POST = async (req: NextRequest) => {
    
    const { userId, orgId} = auth();
    
    if (!userId || !orgId) {
        return new NextResponse("Unauthorized", { status: 401 });
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

    const isPro = await checkSubscription();

    if (!isPro) {
        await incrementAvailableAITokens();
    }

    //TODO: check if maximum has reached

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