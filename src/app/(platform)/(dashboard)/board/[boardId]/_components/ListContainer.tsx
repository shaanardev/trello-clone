"use client";

import { useEffect, useState } from "react";
import { DragDropContext, type DropResult, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";

import type { BoardListWithCards } from "@/types";
import { BoardListForm } from "./ListForm";
import { BoardListItem } from "./ListItem";
import { useAction } from "@/hooks/useActions";
import { updateBoardListOrder } from "@/actions/board-list/update-order";
import { updateBoardCardOrder } from "@/actions/board-card/update-order";

interface BoardListContainerProps {
	boardId: string;
	boardLists: BoardListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
}

export const BoardListContainer = ({
	boardId,
	boardLists,
}: BoardListContainerProps) => {
	const { execute: updateListOrder } = useAction(updateBoardListOrder, {
		onSuccess: () => toast.success("List reordered"),
		onError: (error) => toast.error(error),
	});

	const { execute: updateCardOrder } = useAction(updateBoardCardOrder, {
		onSuccess: () => toast.success("Card reordered"),
		onError: (error) => toast.error(error),
	});

	const [orderedData, setOrderedData] = useState<BoardListWithCards[]>(boardLists);

	useEffect(() => {
		setOrderedData(boardLists);
	}, [boardLists]);

	const onDragEnd = (result: DropResult) => {
		const { destination, source, type } = result;

		if (!destination) {
			return;
		}

		const { droppableId: destDroppableId, index: destIndex } = destination;
		const { droppableId: sourceDroppableId, index: sourceIndex } = source;
		// Dropped in the same position
		if (
			destDroppableId === sourceDroppableId &&
			destIndex === sourceIndex
		) {
			return;
		}

		// user moves a list
		if (type === "list") {
			const items = reorder(orderedData, sourceIndex, destIndex).map(
				(item, index) => ({ ...item, order: index }),
			);

			setOrderedData(items);
			updateListOrder({ items, boardId });
		}

		// user moves a card
		if (type === "card") {
			let newOrderedData = [...orderedData];

			// source and destination list
			const sourceList = newOrderedData.find(
				(list) => list.id === sourceDroppableId,
			);
			const destList = newOrderedData.find(
				(list) => list.id === destDroppableId,
			);

			if (!sourceList || !destList) {
				return;
			}

			// check if cards exist on the source list
			if (!sourceList.cards) {
				sourceList.cards = [];
			}

			// check if cards exist on the source list
			if (!destList.cards) {
				destList.cards = [];
			}

			// moving the card to in the same list
			if (sourceDroppableId === destDroppableId) {
				const reorderedCards = reorder(
					sourceList.cards,
					sourceIndex,
					destIndex,
				);
				reorderedCards.forEach((card, index) => {
					card.order = index;
				});

				sourceList.cards = reorderedCards;

				setOrderedData(newOrderedData);
				updateCardOrder({ boardId, items: reorderedCards });
			} else {
				// user moves card to another list sourceDroppableId !== destDroppableId
				// remove card from source list
				const [movedCard] = sourceList.cards.splice(sourceIndex, 1);

				// assign new list id to the moved card
				movedCard.boardListId = destDroppableId;

				// Add card to destination list
				destList.cards.splice(destIndex, 0, movedCard);

				sourceList.cards.forEach((card, index) => {
					card.order = index;
				});

				// update the order for each card in the destination list
				destList.cards.forEach((card, index) => {
					card.order = index;
				});

				setOrderedData(newOrderedData);
				updateCardOrder({ boardId, items: destList.cards });
			}
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="lists" type="list" direction="horizontal">
				{({ innerRef, droppableProps, placeholder }) => (
					<ol
						ref={innerRef}
						{...droppableProps}
						className="flex h-full gap-x-3"
					>
						{orderedData.map((boardList, index) => (
							<BoardListItem
								key={boardList.id}
								index={index}
								boardList={boardList}
							/>
						))}
						{placeholder}
						<BoardListForm />
						<div className="w-1 flex-shrink-0" />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	);
};
