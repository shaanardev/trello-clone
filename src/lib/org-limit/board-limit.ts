import { MAX_FREE_BOARDS } from "@/constants/limits";
import { modifyAvailableLimit, hasReachedLimit, getAvailableLimit } from "./helpers";

export const incrementAvailableBoardCount = () => modifyAvailableLimit(count => count + 1, "boardCount");
export const decreaseAvailableBoardCount = () => modifyAvailableLimit(count => Math.max(0, count - 1), "boardCount");
export const hasReachedMaximumBoardCount = () => hasReachedLimit("boardCount", MAX_FREE_BOARDS);
export const availableBoardCount = () => getAvailableLimit("boardCount");