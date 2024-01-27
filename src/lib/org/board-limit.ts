import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/limits";

const modifyAvailableBoardCount = async (modifyCountAction: (count: number) => number) => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    if (orgLimit) {
        await db.orgLimit.update({
            where: {
                orgId
            },
            data: {
                boardCount: modifyCountAction(orgLimit.boardCount)
            }
        });
    } else {
        await db.orgLimit.create({
            data: {
                orgId,
                boardCount: 1
            }
        });
    }
}

export const incrementAvailableBoardCount = () => modifyAvailableBoardCount(count => count + 1);
export const decreaseAvailableBoardCount = () => modifyAvailableBoardCount(count => Math.max(0, count - 1));

export const hasAvailableBoardCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return !orgLimit || orgLimit.boardCount < MAX_FREE_BOARDS;
};

export const getAvailableBoardCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        return 0;
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return orgLimit?.boardCount ?? 0;
};
