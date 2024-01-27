"use client";

import type { BoardCard } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd"
import { useCardModal } from "@/hooks/useCardModal";


interface BoardCardItemProps {
    boardCard: BoardCard;
    index: number;
}

export const BoardCardItem = ({boardCard, index}: BoardCardItemProps) => {
    const { onOpen } = useCardModal();

    return (
        <Draggable
            draggableId={boardCard.id}
            index={index}
        >   
            {({ innerRef, draggableProps, dragHandleProps }) => (
                <div 
                    ref={innerRef}
                    {...draggableProps}
                    {...dragHandleProps}
                    role="button"
                    onClick={() => onOpen(boardCard.id)}
                    className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
                >
                    {boardCard.title}
                </div> 
            )}    
        </Draggable>
    );
};


