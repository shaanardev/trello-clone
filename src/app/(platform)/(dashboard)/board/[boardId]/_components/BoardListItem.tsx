"use client";

import type { BoardListWithCards } from "@/types";
import { BoardListHeader } from "./BoardListHeader";

interface BoardListItemProps {
    boardList: BoardListWithCards;
    index: number;
}

export const BoardListItem = ({ boardList, index }: BoardListItemProps) => {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <BoardListHeader boardList={boardList}/>
            </div>
        </li>
    );
};
