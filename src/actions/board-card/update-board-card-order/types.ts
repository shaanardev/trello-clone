import { z } from "zod";
import type { BoardCard } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateBoardCardOrderSchema } from "./schema";

export type InputType = z.infer<typeof UpdateBoardCardOrderSchema>;
export type ReturnType = ActionState<InputType, BoardCard[]>;