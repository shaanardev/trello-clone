"use client";

import type { BoardCard } from "@prisma/client";

interface BoardCardItemProps {
    boardCard: BoardCard;
    index: number;
}

export const BoardCardItem = ({boardCard, index}: BoardCardItemProps) => {
    return (
        <div 
            role="button"
            className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
            {boardCard.title}
        </div>
    );
};
