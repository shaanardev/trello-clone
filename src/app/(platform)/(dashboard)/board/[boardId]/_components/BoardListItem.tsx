"use client";

import { type ElementRef, useRef, useState } from "react";

import type { BoardListWithCards } from "@/types";
import { BoardListHeader } from "./BoardListHeader";
import { BoardCardForm } from "./BoardCardForm";
import { cn } from "@/lib/utils";
import { BoardCardItem } from "./BoardCardItem";

interface BoardListItemProps {
    boardList: BoardListWithCards;
    index: number;
}

export const BoardListItem = ({ boardList, index }: BoardListItemProps) => {
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const enableEditing = () => {
        setIsEditing(true);
        textareaRef?.current?.focus();
    }

    const disableEditing = () => setIsEditing(false);

    const totalCards = boardList.cards.length;

    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <BoardListHeader 
                    onAddCard={enableEditing} 
                    boardList={boardList}
                />
                <ol
                    className={cn(
                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                        totalCards > 0 ? "mt-2" : "mt-0"
                    )}
                >
                    {boardList.cards.map((card, index) => (
                        <BoardCardItem 
                            key={card.id}
                            index={index}
                            boardCard={card}
                        />
                    ))}
                </ol>
                <BoardCardForm 
                    boardListId={boardList.id}
                    ref={textareaRef}
                    isEditing={isEditing}
                    enableEditing={enableEditing}
                    disableEditing={disableEditing}
                />
            </div>
        </li>
    );
};
