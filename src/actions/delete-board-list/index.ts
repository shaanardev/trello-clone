"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoardListSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data;

    let boardList;

    try {
        boardList = await db.boardList.delete({
            where: {
                id, 
                boardId,
                board: {
                    orgId
                }
            }
        });
    } catch (error) {
        return {
            error: `Internal Server Error - Failed to delete board`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardList };
}

export const deleteBoardList = createSafeAction(DeleteBoardListSchema, handler);