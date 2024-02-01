"use client";

import type { BoardCard } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/useCardModal";

interface BoardCardItemProps {
	boardCard: BoardCard;
	index: number;
}

export const BoardCardItem = ({ boardCard, index }: BoardCardItemProps) => {
	const { onOpen } = useCardModal();

	return (
		<Draggable draggableId={boardCard.id} index={index}>
			{({ innerRef, draggableProps, dragHandleProps }) => (
				<div
					ref={innerRef}
					{...draggableProps}
					{...dragHandleProps}
					role="button"
					onClick={() => onOpen(boardCard.id)}
					className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-black dark:text-white dark:bg-black dark:hover:bg-black/80"
				>
					{boardCard.title}
				</div>
			)}
		</Draggable>
	);
};
