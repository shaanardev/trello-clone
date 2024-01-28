"use client";

import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionContext } from "@/components/providers/SubscriptionProvider";

export const OrgInfo = () => {
	const { organization, isLoaded } = useOrganization();
	const isPro = useSubscriptionContext();

	if (!isLoaded) {
		return <OrgInfo.Skeleton></OrgInfo.Skeleton>;
	}

	return (
		<div className="flex items-center gap-x-4">
			<div className="relative h-[60px] w-[60px]">
				<Image
					fill
					src={organization?.imageUrl!}
					alt="organization"
					className="rounded-md object-cover"
				/>
			</div>
			<div className="space-y-1">
				<p className="text-xl font-semibold">{organization?.name}</p>
				<div className="flex items-center text-xs text-muted-foreground">
					<CreditCard className="mr-2 h-3 w-3" />
					{isPro ? "Pro" : "Free"}
				</div>
			</div>
		</div>
	);
};

OrgInfo.Skeleton = function OrgInfoSkeleton() {
	return (
		<div className="flex items-center gap-x-4">
			<div className="relative h-[60px] w-[60px]">
				<Skeleton className="absolute h-full w-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-10 w-[200px]" />
				<div className="flex items-center">
					<Skeleton className="mr-2 h-4 w-4" />
					<Skeleton className="h-4 w-[100px]" />
				</div>
			</div>
		</div>
	);
};
