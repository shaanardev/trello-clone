"use client";

import { useEffect, useState } from "react";

import type { BoardListWithCards } from "@/types";
import { BoardListForm } from "./BoardListForm";
import { BoardListItem } from "./BoardListItem";

interface BoardListContainerProps {
    boardId: string;
    boardLists: BoardListWithCards[]
}

export const BoardListContainer = ({ boardId, boardLists }: BoardListContainerProps) => {
    const [orderedData, setOrderedData] = useState<BoardListWithCards[]>(boardLists);

    useEffect(() => {
        setOrderedData(boardLists);
    }, [boardLists])

    return (
        <ol className="flex gap-x-3 h-full">
            {orderedData.map((boardList, index) =>(
                <BoardListItem 
                    key={boardList.id}
                    index={index}
                    boardList={boardList}
                />
            ))}
            <BoardListForm />
            <div className="flex-shrink-0 w-1" />
        </ol>
    );
};
