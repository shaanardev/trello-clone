"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyBoardListSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

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
        const listToCopy = await db.boardList.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            include: {
                cards: true
            }
        });

        if (!listToCopy) {
            return {
                error: `List not found`
            };
        }

        const lastList = await db.boardList.findFirst({
            where: {
                boardId
            },
            orderBy: { 
                order: "desc"
            },
            select: {
                order: true
            }
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        boardList = await db.boardList.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title}-Copy`,
                order: newOrder,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((c) => {
                            return {
                                title: c.title,
                                description: c.description,
                                order: c.order
                            };
                        })
                    },
                },
            },
            include: {
                cards: true
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
            error: `Failed to copy`
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: boardList };
}

export const copyBoardList = createSafeAction(CopyBoardListSchema, handler);