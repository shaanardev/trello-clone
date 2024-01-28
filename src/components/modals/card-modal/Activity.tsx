"use client";

import { ActivityItem } from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

interface CardModalActivityLogsProps {
	activityLogs: AuditLog[];
}

export const CardModalActivityLogs = ({
	activityLogs,
}: CardModalActivityLogsProps) => {
	return (
		<div className="flex w-full items-start gap-x-3">
			<ActivityIcon className="mt-0.5 h-5 w-5 text-neutral-700" />
			<div className="w-full">
				<p className="mb-2 font-semibold text-neutral-700">Activity</p>
				<ol className="mt-2 space-y-4">
					{activityLogs.map((log) => (
						<ActivityItem key={log.id} activity={log} />
					))}
				</ol>
			</div>
		</div>
	);
};

CardModalActivityLogs.Skeleton = function CardModalActivityLogsSKeleton() {
	return (
		<div className="flex w-full items-start gap-x-3">
			<Skeleton className="h-6 w-6 bg-neutral-300" />
			<div className="w-full">
				<Skeleton className="mb-2 h-6 w-24 bg-neutral-300" />
				<Skeleton className="h-10 w-full bg-neutral-300" />
			</div>
		</div>
	);
};
