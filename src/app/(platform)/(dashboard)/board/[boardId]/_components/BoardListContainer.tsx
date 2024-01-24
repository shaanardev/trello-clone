"use client";

import type { BoardListWithCards } from "@/types";
import { BoardListForm } from "./BoardListForm";

interface BoardListContainerProps {
    boardId: string;
    boardLists: BoardListWithCards[]
}

export const BoardListContainer = ({ boardId, boardLists }: BoardListContainerProps) => {
    return (
        <ol>
            <BoardListForm />
            <div className="flex-shrink-0 w-1" />
        </ol>
    );
};
