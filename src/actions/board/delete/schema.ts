import { z } from "zod";

export const DeleteBoardSchema = z.object({
    boardId: z.string()
});