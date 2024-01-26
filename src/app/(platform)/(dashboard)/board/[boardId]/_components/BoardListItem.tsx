"use client";

import { type ElementRef, useRef, useState } from "react";

import type { BoardListWithCards } from "@/types";
import { BoardListHeader } from "./BoardListHeader";
import { CardForm } from "./CardForm";

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



    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <BoardListHeader 
                    onAddCard={enableEditing} 
                    boardList={boardList}
                />
                <CardForm 
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
