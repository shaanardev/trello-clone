import { z } from "zod";

export const CreateCardSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title is required"
    }).min(3, {
        message: "Minimum of 3 characters is required"
    }),
    boardListId: z.string(),
    boardId: z.string()
});

