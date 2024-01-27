import { z } from "zod";

export const DeleteBoardCardSchema = z.object({
    id: z.string(),
    boardId: z.string()
});