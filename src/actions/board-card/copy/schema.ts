import { z } from "zod";

export const CopyBoardCardSchema = z.object({
    id: z.string(),
    boardId: z.string()
});