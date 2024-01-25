"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardListSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, id, boardId } = data;

    let boardList;

    try {
        boardList = await db.boardList.update({
            where: {
                id, 
                boardId,
                board: {
                    orgId
                }
            },
            data: {
                title
            }
        });
    } catch (error) {
        return {
            error: `Internal Server Error - Failed to update board with title ${title}`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardList };
}

export const updateBoardList = createSafeAction(UpdateBoardListSchema, handler);