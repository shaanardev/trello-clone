"use client";

import { Copy, Trash } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import type { BoardCardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { copyBoardCard } from "@/actions/board-card/copy";
import { deleteBoardCard } from "@/actions/board-card/delete";
import { useAction } from "@/hooks/useActions";
import { useCardModal } from "@/hooks/useCardModal";

interface CardModalActionsProps {
	card: BoardCardWithList;
}

export const CardModalActions = ({ card }: CardModalActionsProps) => {
	const params = useParams();
	const boardId = params.boardId as string;
	const { id } = card;

	const onClose = useCardModal((state) => state.onClose);

	const { execute: copyCard, isLoading: isCardCopying } = useAction(
		copyBoardCard,
		{
			onSuccess: ({ title }) => {
				toast.success(`Card "${title}" copied`);
				onClose();
			},
			onError: (error) => toast.error(error),
		},
	);
	const { execute: deleteCard, isLoading: isCardDeleting } = useAction(
		deleteBoardCard,
		{
			onSuccess: () => {
				toast.success("Card deleted");
				onClose();
			},
			onError: (error) => toast.error(error),
		},
	);

	return (
		<div className="mt-2 space-y-2">
			<p className="text-xs font-semibold">Actions</p>
			<Button
				variant="gray"
				size="inline"
				disabled={isCardCopying}
				onClick={() => copyCard({ id, boardId })}
				className="w-full justify-start"
			>
				<Copy className="mr-2 h-4 w-4" />
				Copy
			</Button>
			<Button
				variant="gray"
				size="inline"
				disabled={isCardDeleting}
				onClick={() => deleteCard({ id, boardId })}
				className="w-full justify-start"
			>
				<Trash className="mr-2 h-4 w-4 text-red-600" />
				Delete
			</Button>
		</div>
	);
};

CardModalActions.Skeleton = function CardModalActionsSkeleton() {
	return (
		<div className="mt-2 space-y-2">
			<Skeleton className="h-4 w-20 bg-neutral-300" />
			<Skeleton className="h-8 w-full bg-neutral-300" />
			<Skeleton className="h-8 w-full bg-neutral-300" />
		</div>
	);
};
