import { auth } from "@clerk/nextjs";

import { db } from "../db";
import { OrgLimit } from "@prisma/client";

type Key = keyof OrgLimit
type OmittedKeys = "id" | "orgId" | "createdAt" | "updatedAt";
type LimitKey =  Exclude<Key, OmittedKeys>;

export const modifyAvailableLimit = async (modifyCountAction: (count: number) => number, limitKey: LimitKey) => {
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
                [limitKey]: modifyCountAction(orgLimit[limitKey])
            }
        });
    } else {
        await db.orgLimit.create({
            data: {
                orgId,
                [limitKey]: 1
            }
        });
    }
};

export const hasReachedLimit = async (key: LimitKey, maximumLimit: number) => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return !orgLimit || orgLimit[key] < maximumLimit;
}


export const getAvailableLimit = async (key: LimitKey) => {
    const { orgId } = auth();

    if (!orgId) {
        return 0;
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    return orgLimit?.[key] ?? 0;
};