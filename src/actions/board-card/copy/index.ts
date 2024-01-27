"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyBoardCardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

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
        const cardToCopy = await db.boardCard.findUnique({
            where: {
                id,
                boardList: {
                    board: {
                        orgId
                    }
                }
            }
        });

        if (!cardToCopy) {
            return {
                error: `No card found`
            };
        }

        const { boardListId, title, description } = cardToCopy;
        const lastCard = await db.boardCard.findFirst({
            where: {
                boardListId: boardListId
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
                title: `${title}-Copy`,
                description: description,
                order: newOrder,
                boardListId: boardListId
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
            error: `Failed to copy`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardCard };
};

export const copyBoardCard = createSafeAction(CopyBoardCardSchema, handler);