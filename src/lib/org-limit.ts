import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

const modifyAvailableCount = async (modifyCountAction: (count: number) => number) => {
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
                count: modifyCountAction(orgLimit.count)
            }
        });
    } else {
        await db.orgLimit.create({
            data: {
                orgId,
                count: 1
            }
        });
    }
}

export const incrementAvailableCount = () => modifyAvailableCount(count => count + 1);
export const decreaseAvailableCount = () => modifyAvailableCount(count => Math.max(0, count - 1));

export const hasAvailableCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
};

export const getAvailableCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        return 0;
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return orgLimit?.count ?? 0;
};
