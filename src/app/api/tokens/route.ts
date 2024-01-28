import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const GET = async (_req: Request, { params }: { params: { cardId: string } }) => {
    try {
        const { userId, orgId } = auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const limit = await db.orgLimit.findUnique({
            where: {
                orgId
            },
            select: {
                aiTokens: true
            }
        });

        return NextResponse.json(limit?.aiTokens ?? 0);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};