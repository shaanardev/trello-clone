import { z } from "zod";

const ListItemsSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        order: z.number(),
        createdAt: z.date(),
        updatedAt: z.date()
    })
);

export const UpdateBoardListOrderSchema = z.object({
    items: ListItemsSchema,
    boardId: z.string(),
})