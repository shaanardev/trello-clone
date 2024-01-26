import { z } from "zod";

export const DeleteBoardListSchema = z.object({
    id: z.string(),
    boardId: z.string()
});