"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

import type { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { decreaseAvailableBoardCount } from "@/lib/org-limit/board-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const isPro = await checkSubscription();
    const { boardId } = data;

    let board;

    try {
        board = await db.board.delete({
            where: {
                id: boardId, 
                orgId
            }
        });

        if (!isPro) {
            await decreaseAvailableBoardCount();
        }
        
        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE
        });
    } catch (error) {
        return {
            error: `Internal Server Error - Failed to delete board`
        }
    }

    const route = `/organization/${orgId}`;
    revalidatePath(route);
    redirect(route)
}

export const deleteBoard = createSafeAction(DeleteBoardSchema, handler);