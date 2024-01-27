import { z } from "zod";
import type { BoardCard } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CopyBoardCardSchema } from "./schema";

export type InputType = z.infer<typeof CopyBoardCardSchema>;
export type ReturnType = ActionState<InputType, BoardCard>;