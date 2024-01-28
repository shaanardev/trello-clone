"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { NavItem, type Organization } from "./NavItem";

interface SidebarProps {
	storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
	const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
		storageKey,
		{},
	);
	const { organization: activeOrg, isLoaded: isOrgLoaded } =
		useOrganization();
	const { userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
		userMemberships: {
			infinite: true,
		},
	});

	const defaultAccordionValues: string[] = Object.keys(expanded).reduce(
		(acc: string[], key: string) => {
			if (expanded[key]) {
				acc.push(key);
			}

			return acc;
		},
		[],
	);

	const onExpand = (id: string) => {
		setExpanded((curr) => ({
			...curr,
			[id]: !expanded[id],
		}));
	};

	if (!isOrgLoaded || !isOrgListLoaded || userMemberships.isLoading) {
		return (
			<>
				<div className="mb-2 flex items-center justify-between">
					<Skeleton className="h-10 w-[50%]" />
					<Skeleton className="h-10 w-10" />
				</div>
				<div className="space-y-2">
					<NavItem.Skeleton />
					<NavItem.Skeleton />
					<NavItem.Skeleton />
				</div>
			</>
		);
	}

	return (
		<>
			<div className="mb-1 flex items-center text-xs font-medium">
				<span className="pl-4">Workspaces</span>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					className="ml-auto"
					asChild
				>
					<Link href="/select-org">
						<Plus className="h-4 w-4" />
					</Link>
				</Button>
			</div>
			<Accordion
				type="multiple"
				defaultValue={defaultAccordionValues}
				className="space-y-2"
			>
				{userMemberships.data.map(({ organization }) => (
					<NavItem
						key={organization.id}
						isActive={activeOrg?.id === organization.id}
						isExpanded={expanded[organization.id]}
						organization={organization as Organization}
						onExpand={onExpand}
					/>
				))}
			</Accordion>
		</>
	);
};

export default Sidebar;
