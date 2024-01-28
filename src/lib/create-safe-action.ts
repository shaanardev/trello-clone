import { z } from "zod";

export type FormFieldErrors<T> = {
    [Key in keyof T]?: string[];
}

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FormFieldErrors<TInput>;
    error?: string | null;
    data?: TOutput;
}

export const createSafeAction = <TInput, TOutput>(
    schema: z.Schema<TInput>,
    handler: (validatedDate: TInput) => Promise<ActionState<TInput, TOutput>>,

) => {
    return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
        const validationRes = schema.safeParse(data);

        if (!validationRes.success) {
            return {
                fieldErrors: validationRes.error.flatten().fieldErrors as FormFieldErrors<TInput>
            }
        }

        return handler(validationRes.data);
    }
}