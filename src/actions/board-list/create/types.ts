import { z } from "zod";
import { type BoardList } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { CreateBoardListSchema } from "./schema";

export type InputType = z.infer<typeof CreateBoardListSchema>;
export type ReturnType = ActionState<InputType, BoardList>;