import { z } from "zod";

const ListItemsSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        order: z.number(),
        boardListId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date()
    })
);

export const UpdateBoardCardOrderSchema = z.object({
    items: ListItemsSchema,
    boardId: z.string()
})