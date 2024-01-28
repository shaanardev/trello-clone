import { type Board } from "@prisma/client";

import { BoardTitleForm } from "./TitleForm";
import { BoardOptions } from "./Options";

interface BoardNavbarProps {
	board: Board;
}

export const BoardNavbar = async ({ board }: BoardNavbarProps) => {
	return (
		<div className="fixed top-14 z-[40] flex h-14 w-full items-center gap-x-4 bg-black/50 px-6 text-white">
			<BoardTitleForm board={board} />
			<div className="ml-auto">
				<BoardOptions boardId={board.id} />
			</div>
		</div>
	);
};
