import { z } from "zod";
import { type BoardCard } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { CreateCardSchema } from "./schema";

export type InputType = z.infer<typeof CreateCardSchema>;
export type ReturnType = ActionState<InputType, BoardCard>;