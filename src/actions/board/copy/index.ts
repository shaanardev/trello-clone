"use server";

import { auth } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION, Board } from "@prisma/client";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyBoardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { boardId } = data;

    let board: Board;

    try {
        const boardToCopy = await db.board.findUnique({
            where: {
                id: boardId,
                orgId
            },
            include: {
                lists: {
                    include: {
                        cards: true
                    }
                }
            }
        });

        if (!boardToCopy) {
            return {
                error: `List not found`
            };
        }

        const {
            title,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageUserName,
            imageLinkHTML
        } = boardToCopy;

        board = await db.board.create({
            data: {
                orgId,
                title: `${title}-Copy`,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML
            },
            include: {
                lists: {
                    include: {
                        cards: true
                    }
                }
            }
        });

        const copyListsTransactions = boardToCopy.lists.map(({ title, order, cards }) => 
            db.boardList.create({
                data: {
                    title,
                    boardId: board.id,
                    order,
                    cards: {
                        createMany: {
                            data: cards.map((c) => {
                                return {
                                    title: c.title,
                                    description: c.description,
                                    order: c.order
                                };
                            })
                        },
                    },
                }
            })
        );

        await db.$transaction(copyListsTransactions);

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE
        });
    } catch (error) {
        console.log(error);
        return {
            error: `Failed to copy`
        }
    }

    redirect(`/board/${board.id}`);
    return { data: board };
}

export const copyBoard = createSafeAction(CopyBoardSchema, handler);