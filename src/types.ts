import { BoardList, BoardCard } from "@prisma/client";

export type BoardListWithCards = BoardList & { cards: BoardCard[] };

export type BoardCardWithList = BoardCard & { boardList: BoardList };