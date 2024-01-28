import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const GET = async (req: Request, { params }: { params: { cardId: string } }) => {
    try {
        const { userId, orgId } = auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { cardId } = params;
        const card = await db.boardCard.findUnique({
            where: {
                id: cardId,
                boardList: {
                    board: {
                        orgId
                    }
                }
            },
            include: {
                boardList: {
                    select: {
                        title: true
                    }
                }
            }
        });

        return NextResponse.json(card);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};