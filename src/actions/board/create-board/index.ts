"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import type { InputType, ReturnType } from "./types";
import { CreateBoardSchema } from "./schema";

const handler = async(data: InputType):Promise<ReturnType> => {
    const { userId, orgId } = auth();
    
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, image } = data;
    // see in FormPicker the value of its hidden input why we are splitting by pipe
    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|");

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
        return {
            error: "Missing fields. Failed to create board."
        };
    }

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName
            }
        });
    } catch (error) {
        return {
            error: `Internal Server Error  - Failed to create board with title ${title}`
        }
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board };
}

export const createBoard = createSafeAction(CreateBoardSchema, handler);