"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardListOrderSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { boardId, items } = data;

    let boardLists;

    try {
        const transaction = items.map(({ id, order }) => 
            db.boardList.update({
                where: {
                    id,
                    board: {
                        orgId
                    }
                },
                data: {
                    order
                }
            })
        );

        boardLists = await db.$transaction(transaction);
    } catch (error) {
        return {
            error: `Internal Server Error - Failed to reorder board lists`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardLists };
}

export const updateBoardListOrder = createSafeAction(UpdateBoardListOrderSchema, handler);