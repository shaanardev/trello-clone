import { z } from "zod";
import type { BoardCard } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteBoardCardSchema } from "./schema";

export type InputType = z.infer<typeof DeleteBoardCardSchema>;
export type ReturnType = ActionState<InputType, BoardCard>;