"use client";

import { ActivityItem } from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

interface CardModalActivityLogsProps {
    activityLogs: AuditLog[]
}

export const CardModalActivityLogs = ({ activityLogs }: CardModalActivityLogsProps) => {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Activity
                </p>
                <ol className="mt-2 space-y-4">
                    {activityLogs.map((log) => (
                        <ActivityItem
                            key={log.id}
                            activity={log}
                        />
                    ))}
                </ol>
            </div>
        </div>
    );
};

CardModalActivityLogs.Skeleton = function CardModalActivityLogsSKeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-300" />
            <div className="w-full">
                <Skeleton className="h-6 w-24 mb-2 bg-neutral-300" />
                <Skeleton className="h-10 w-full bg-neutral-300" />
            </div>
        </div>
    );
};