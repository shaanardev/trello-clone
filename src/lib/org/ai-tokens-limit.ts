import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/limits";

const modifyAvailableAITokens = async (modifyCountAction: (count: number) => number) => {
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
                aiTokens: modifyCountAction(orgLimit.aiTokens)
            }
        });
    } else {
        await db.orgLimit.create({
            data: {
                orgId,
                aiTokens: 1
            }
        });
    }
}

export const incrementAvailableAITokens = () => modifyAvailableAITokens(count => count + 1);
export const decreaseAvailableAITokens = () => modifyAvailableAITokens(count => Math.max(0, count - 1));

export const hasAvailableAITokens = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return !orgLimit || orgLimit.aiTokens < MAX_FREE_BOARDS;
};

export const getAvailableAITokens = async () => {
    const { orgId } = auth();

    if (!orgId) {
        return 0;
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return orgLimit?.aiTokens ?? 0;
};
