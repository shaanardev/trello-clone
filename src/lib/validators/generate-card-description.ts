import { z } from "zod";

export const GenerateCardDescriptionSchema = z.object({
    cardId: z.string({
        required_error: "Card ID required",
        invalid_type_error: "Card ID required"
    }),
    title: z.string(),
    description: z.optional(z.string()).nullish()
});

export type GenerateCardDescriptionType = z.infer<typeof GenerateCardDescriptionSchema>;