import { z } from "zod";
import type { BoardList } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateBoardListSchema } from "./schema";

export type InputType = z.infer<typeof UpdateBoardListSchema>;
export type ReturnType = ActionState<InputType, BoardList>;