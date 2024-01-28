import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface AuditLogParams {
    entityId: string;
    entityTitle: string;
    entityType: ENTITY_TYPE;
    action: ACTION;
}

export const createAuditLog = async ({ entityId, entityTitle, entityType, action }: AuditLogParams) => {
    try {
        const { orgId } = auth();
        const user = await currentUser();

        if (!user || !orgId) {
            throw new Error("Unauthorized - no user found");
        }

        const { id: userId, imageUrl: userImage, firstName, lastName } = user;
        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId,
                userImage,
                userName: `${firstName} ${lastName}`
            }
        })
    } catch (error) {
        console.error("[AUDIT_LOG_ERROR]", error);
    }
} 