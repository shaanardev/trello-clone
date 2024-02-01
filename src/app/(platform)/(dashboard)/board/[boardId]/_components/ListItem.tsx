"use client";

import { type ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import type { BoardListWithCards } from "@/types";
import { BoardListHeader } from "./ListHeader";
import { BoardCardForm } from "./CardForm";
import { cn } from "@/lib/utils";
import { BoardCardItem } from "./CardItem";

interface BoardListItemProps {
	boardList: BoardListWithCards;
	index: number;
}

export const BoardListItem = ({ boardList, index }: BoardListItemProps) => {
	const textareaRef = useRef<ElementRef<"textarea">>(null);

	const [isEditing, setIsEditing] = useState<boolean>(false);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => textareaRef?.current?.focus());
	};

	const disableEditing = () => setIsEditing(false);

	const totalCards = boardList.cards.length;

	return (
		<Draggable draggableId={boardList.id} index={index}>
			{({ innerRef, draggableProps, dragHandleProps }) => (
				<li
					ref={innerRef}
					{...draggableProps}
					className="h-full w-[272px] shrink-0 select-none "
				>
					<div
						{...dragHandleProps}
						className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md "
					>
						<BoardListHeader
							onAddCard={enableEditing}
							boardList={boardList}
						/>

						<Droppable droppableId={boardList.id} type="card">
							{({ innerRef, droppableProps, placeholder }) => (
								<ol
									ref={innerRef}
									{...droppableProps}
									className={cn(
										"mx-1 flex flex-col gap-y-2 px-1 py-0.5",
										totalCards > 0 ? "mt-2" : "mt-0",
									)}
								>
									{boardList.cards.map((card, index) => (
										<BoardCardItem
											key={card.id}
											index={index}
											boardCard={card}
										/>
									))}
									{placeholder}
								</ol>
							)}
						</Droppable>
						<BoardCardForm
							boardListId={boardList.id}
							ref={textareaRef}
							isEditing={isEditing}
							enableEditing={enableEditing}
							disableEditing={disableEditing}
						/>
					</div>
				</li>
			)}
		</Draggable>
	);
};
