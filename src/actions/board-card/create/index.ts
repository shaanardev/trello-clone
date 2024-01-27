"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import type { InputType, ReturnType } from "./types";
import { CreateCardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async(data: InputType):Promise<ReturnType> => {
    const { userId, orgId } = auth();
    
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, boardListId, boardId } = data;

    let boardCard;

    try {
        const boardList = await db.boardList.findUnique({
            where: {
                id: boardListId,
                board: {
                    orgId
                }
            }
        })

        if (!boardList) {
            return {
                error: `Board list not found`
            };
        }

        const lastCard = await db.boardCard.findFirst({
            where: {
                boardListId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        boardCard = await db.boardCard.create({
            data: {
                title,
                boardListId,
                order: newOrder
            }
        });

        await createAuditLog({
            entityId: boardCard.id,
            entityTitle: boardCard.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE
        });
    } catch (error) {
        return {
            error: `Internal Server Error  - Failed to create board with title ${title}`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardCard };
}

export const createCard = createSafeAction(CreateCardSchema, handler);