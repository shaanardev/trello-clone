import { MAX_FREE_AI_TOKENS } from "@/constants/limits";
import { hasReachedLimit, modifyAvailableLimit, getAvailableLimit } from "./helpers";

export const incrementAvailableAITokens = () => modifyAvailableLimit(count => count + 1, "aiTokens");
export const decreaseAvailableAITokens = () => modifyAvailableLimit(count => Math.max(0, count - 1), "aiTokens");
export const hasReachedMaximumTokens = () => hasReachedLimit("aiTokens", MAX_FREE_AI_TOKENS);
export const availableTokens = () => getAvailableLimit("aiTokens");
