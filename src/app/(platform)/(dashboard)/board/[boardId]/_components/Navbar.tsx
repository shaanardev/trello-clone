import { type Board } from "@prisma/client";

import { BoardTitleForm } from "./TitleForm";
import { BoardOptions } from "./Options";

interface BoardNavbarProps {
    board: Board;
}

export const BoardNavbar = async ({ board }: BoardNavbarProps) => {

    return (
        <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
        <BoardTitleForm board={board} />
        <div className="ml-auto">
          <BoardOptions boardId={board.id} />
        </div>
      </div>
    );
};