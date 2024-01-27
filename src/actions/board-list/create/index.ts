"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import type { InputType, ReturnType } from "./types";
import { CreateBoardListSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async(data: InputType):Promise<ReturnType> => {
    const { userId, orgId } = auth();
    
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, boardId } = data;

    let boardList;

    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId
            }
        });

        if (!board) {
            return {
                error: "Board not found"
            }
        }

        const lastList = await db.boardList.findFirst({
            where: {
                boardId,
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        });

        boardList = await db.boardList.create({
            data: {
                title,
                boardId,
                order: lastList ? lastList.order + 1 : 1
            }
        });
        
        await createAuditLog({
            entityId: boardList.id,
            entityTitle: boardList.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE
        });
    } catch (error) {
        return {
            error: `Internal Server Error  - Failed to create board with title ${title}`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardList };
}

export const createBoardList = createSafeAction(CreateBoardListSchema, handler);