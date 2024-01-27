"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoardCardSchema } from "./schema";

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
    } catch (error) {
        return {
            error: `Internal Server Error - Failed to delete board card`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardCard };
}

export const deleteBoardCard = createSafeAction(DeleteBoardCardSchema, handler);