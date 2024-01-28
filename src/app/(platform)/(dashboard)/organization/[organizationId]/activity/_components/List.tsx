import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ActivityItem } from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";

export const ActivityList = async () => {
	const { orgId } = auth();

	if (!orgId) {
		redirect("/select-org");
	}

	const logs = await db.auditLog.findMany({
		where: {
			orgId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<ol className="mt-4 space-y-4">
			<p className="hidden text-center text-xs text-muted-foreground last:block">
				No activity found inside this organization
			</p>
			{logs.map((log) => (
				<ActivityItem key={log.id} activity={log} />
			))}
		</ol>
	);
};

ActivityList.Skeleton = function ActivityListSkeleton() {
	return (
		<ol className="mt-4 space-y-4">
			<Skeleton className="h-14 w-[80%]" />
			<Skeleton className="h-14 w-[50%]" />
			<Skeleton className="h-14 w-[70%]" />
			<Skeleton className="h-14 w-[80%]" />
			<Skeleton className="h-14 w-[75%]" />
		</ol>
	);
};
