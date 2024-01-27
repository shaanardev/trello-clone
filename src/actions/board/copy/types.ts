import { Board } from "@prisma/client";
import { z } from "zod";

import { CopyBoardSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CopyBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;