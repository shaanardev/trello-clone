import { z } from "zod";
import type { BoardCard } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateBoardCardSchema } from "./schema";

export type InputType = z.infer<typeof UpdateBoardCardSchema>;
export type ReturnType = ActionState<InputType, BoardCard>;