"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardCardOrderSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { boardId, items } = data;

    let updatedCards;

    try {
        const transaction = items.map(({ id, order, boardListId }) => 
            db.boardCard.update({
                where: {
                    id,
                    boardList: {
                        board: {
                            orgId
                        }
                    }
                },
                data: {
                    order: order,
                    boardListId: boardListId
                }
            })
        );

        updatedCards = await db.$transaction(transaction);
    } catch (error) {
        return {
            error: `Internal Server Error - Failed to reorder board cards`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: updatedCards };
}

export const updateBoardCardOrder = createSafeAction(UpdateBoardCardOrderSchema, handler);