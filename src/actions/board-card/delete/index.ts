"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoardCardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data;

    let boardCard;

    try {
        boardCard = await db.boardCard.delete({
            where: {
                id, 
                boardList: {
                    board: {
                        orgId
                    }
                },
            }
        });

        await createAuditLog({
            entityId: boardCard.id,
            entityTitle: boardCard.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE
        });
    } catch (error) {
        return {
            error: `Internal Server Error - Failed to delete board card`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardCard };
}

export const deleteBoardCard = createSafeAction(DeleteBoardCardSchema, handler);