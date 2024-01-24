import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BoardListContainer } from "./_components/BoardListContainer";

interface Params {
  boardId: string;
}

interface BoardIdPageProps {
  params: Params
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
	const { orgId } = auth();

	if (!orgId) {
        return redirect("/select-org");
	}

	const { boardId} = params;
	const boardLists = await db.boardList.findMany({
		where: {
			boardId: boardId,
			board: {
				orgId
			},
		},
		include: {
			cards: {
				orderBy: {
					order: "asc"
				},
			},
		},
		orderBy: {
			order: "asc"
		}
	});


    return (
        <div className="p-4 h-full overflow-x-auto">
        <BoardListContainer
			boardId={boardId}
			boardLists={boardLists}
        />
      </div>
    );
};

export default BoardIdPage;
