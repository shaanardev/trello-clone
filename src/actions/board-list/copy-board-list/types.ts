import { z } from "zod";
import type { BoardList } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CopyBoardListSchema } from "./schema";

export type InputType = z.infer<typeof CopyBoardListSchema>;
export type ReturnType = ActionState<InputType, BoardList>;