import { z } from "zod";

export const CopyBoardListSchema = z.object({
    id: z.string(),
    boardId: z.string()
});