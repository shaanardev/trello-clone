"use client";

import { useQuery } from "@tanstack/react-query";
import type { AuditLog } from "@prisma/client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/useCardModal";
import type { BoardCardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { CardModalHeader } from "./Header";
import { CardModalDescription } from "./Description";
import { CardModalActions } from "./Actions";
import { CardModalActivityLogs } from "./Activity";
import { CARD_LOGS_QK, CARD_QK } from "@/constants/query-keys";

export const CardModal = () => {
	const id = useCardModal((state) => state.id);
	const isOpen = useCardModal((state) => state.isOpen);
	const onClose = useCardModal((state) => state.onClose);

	const { data: card } = useQuery<BoardCardWithList>({
		queryKey: [CARD_QK, id],
		queryFn: () => fetcher(`/api/cards/${id}`),
	});

	const { data: activityLogs } = useQuery<AuditLog[]>({
		queryKey: [CARD_LOGS_QK, id],
		queryFn: () => fetcher(`/api/cards/${id}/logs`),
	});

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl">
				{!card ? (
					<CardModalHeader.Skeleton />
				) : (
					<CardModalHeader card={card} />
				)}
				<div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
					<div className="col-span-3">
						<div className="w-full space-y-6">
							{!card ? (
								<CardModalDescription.Skeleton />
							) : (
								<CardModalDescription card={card} />
							)}
							{!activityLogs ? (
								<CardModalActivityLogs.Skeleton />
							) : (
								<CardModalActivityLogs
									activityLogs={activityLogs}
								/>
							)}
						</div>
					</div>
					{!card ? (
						<CardModalActions.Skeleton />
					) : (
						<CardModalActions card={card} />
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
