import  { ACTION, type AuditLog } from "@prisma/client"

export const generateLogMessage = (log: AuditLog) => {
    const { action, entityType, entityTitle} = log;

    let messagePrefix = 'unknown';
    switch(action) {
        case ACTION.CREATE:
            messagePrefix = 'created';
        case ACTION.UPDATE:
            messagePrefix = 'updated';
        case ACTION.DELETE:
            messagePrefix = 'deleted';
    }

    return `${messagePrefix} ${entityType.toLocaleLowerCase()} "${entityTitle}"`
}