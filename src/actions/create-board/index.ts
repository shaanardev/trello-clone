"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import type { InputType, ReturnType } from "./types";
import { CreateBoardSchema } from "./schema";

const handler = async(data: InputType):Promise<ReturnType> => {
    const { userId } = auth();
    
    if (!userId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title } = data;

    let board;

    try {
        board = await db.board.create({
            data: {
                title
            }
        })
    } catch (error) {
        return {
            error: `Internal Error - Failed to create board with title ${title}`
        }
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board }
}

export const createBoard = createSafeAction(CreateBoardSchema, handler);