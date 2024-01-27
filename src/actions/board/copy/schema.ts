import { z } from "zod";

export const CopyBoardSchema = z.object({
    boardId: z.string(),
});