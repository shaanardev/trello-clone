import { z } from "zod";
import type { BoardList } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateBoardListOrderSchema } from "./schema";

export type InputType = z.infer<typeof UpdateBoardListOrderSchema>;
export type ReturnType = ActionState<InputType, BoardList[]>;