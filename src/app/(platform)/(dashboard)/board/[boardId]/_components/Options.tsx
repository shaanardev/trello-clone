"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Trash, X, Clipboard, Infinity } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, intervalToDuration } from "date-fns";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/board/delete";
import { useAction } from "@/hooks/useActions";
import { copyBoard } from "@/actions/board/copy";
import { useSubscriptionContext } from "@/components/providers/SubscriptionProvider";
import { Hint } from "@/components/Hint";
import { MAX_FREE_AI_TOKENS } from "@/constants/limits";
import { fetcher } from "@/lib/fetcher";

const calculateTimeLeft = () => {
	const now = new Date();
	const nextHour = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getHours() + 1,
	);

	const duration = intervalToDuration({
		start: now,
		end: nextHour,
	});

	if (duration.minutes && duration.minutes <= 10) {
		return formatDuration(duration, {
			format: ["minutes", "seconds"],
			zero: false,
			delimiter: ", ",
		})
			.replace("minutes", "mins")
			.replace("seconds", "secs");
	}

	if (duration.seconds) {
		if (duration.minutes && duration.minutes <= 10) {
			return formatDuration(duration, {
				format: ["seconds"],
				zero: false,
			}).replace("seconds", "secs");
		}
	}

	return formatDuration(duration, {
		format: ["minutes"],
		zero: false,
	}).replace("seconds", "secs");
};

interface BoardOptionsProps {
	boardId: string;
}

export const BoardOptions = ({ boardId }: BoardOptionsProps) => {
	const isPro = useSubscriptionContext();

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setTimeout(() => {
			const time = calculateTimeLeft();
			setTimeLeft(time);
		}, 1000);

		return () => clearTimeout(timer);
	});

	const { data: aiTokens } = useQuery<number>({
		queryKey: ["tokens"],
		queryFn: () => fetcher(`/api/tokens`),
	});

	const { execute: destroyBoard, isLoading: isDeleting } = useAction(
		deleteBoard,
		{
			onError: (error) => toast.error(error),
		},
	);

	const { execute: cloneBoard, isLoading: isCopying } = useAction(copyBoard, {
		onError: (error) => toast.error(error),
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="h-auto w-auto p-2" variant="transparent">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="bottom"
				align="start"
				className="px-0 pb-3 pt-3"
			>
				<div className="pb-4 text-center text-sm font-medium text-neutral-600">
					Settings
				</div>
				<PopoverClose asChild>
					<Button
						variant="ghost"
						className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<div className="flex flex-col items-center justify-center space-y-3">
					<div className="flex h-auto w-[80%] items-center justify-between rounded-sm p-2 text-sm">
						<span className="font-semibold">AI Tokens:</span>
						<span>
							<Hint
								description={
									isPro
										? "Unlimited tokens"
										: `Resets in ${timeLeft}`
								}
								sideOffset={15}
							>
								{isPro ? (
									<Infinity className="h-4 w-4" />
								) : (
									<span
										className={
											aiTokens && aiTokens === 0
												? "text-red-500"
												: "text-normal"
										}
									>
										{`${MAX_FREE_AI_TOKENS - (aiTokens ?? 0)} remaining`}
									</span>
								)}
							</Hint>
						</span>
					</div>
					<Button
						variant="gray"
						onClick={() => cloneBoard({ boardId })}
						disabled={isCopying}
						className="h-auto w-[80%] rounded-sm p-2 px-5 text-sm font-normal"
					>
						<Clipboard className="mr-2 h-4 w-4" />
						Copy board
					</Button>
					<Button
						variant="destructive"
						onClick={() => destroyBoard({ boardId })}
						disabled={isDeleting}
						className="h-auto w-[80%] rounded-sm p-2 px-5 text-sm font-normal"
					>
						<Trash className="mr-2 h-4 w-4" />
						Delete board
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
