import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/BoardNavbar";

interface Params {
    boardId: string;
}

interface BoardIdLayoutProps extends PropsWithChildren {
    params: Params
}

export async function generateMetadata({ params }: { params: Params }) {
    const { orgId } = auth();
    
    if (!orgId) {
        return {
            title: "Board"
        }; 
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    return {
      title: board?.title || "Board"
    };
};

const BoardIdLayout = async ({ params, children }: BoardIdLayoutProps) => {
    const { orgId } = auth();
    const { boardId } = params;

    if (!orgId) {
        return redirect("/select-org");
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId
        }
    });

    if (!board) {
        notFound();
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavbar board={board} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout;