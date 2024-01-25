import { z } from "zod";
import type { BoardList } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteBoardListSchema } from "./schema";

export type InputType = z.infer<typeof DeleteBoardListSchema>;
export type ReturnType = ActionState<InputType, BoardList>;