import { z } from "zod";

export const CreateBoardListSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title is required"
    }),
    boardId: z.string()
});

