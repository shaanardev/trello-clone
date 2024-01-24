"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, id } = data;

    let board;

    try {
        board = await db.board.update({
            where: {
                id, 
                orgId
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

    revalidatePath(`/board/${id}`);
    return { data: board };
}

export const updateBoard = createSafeAction(UpdateBoardSchema, handler);