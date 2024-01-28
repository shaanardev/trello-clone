import type { PropsWithChildren } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface HintProps extends PropsWithChildren {
	description: string;
	side?: "left" | "right" | "top" | "bottom";
	sideOffset?: number;
}

export const Hint = ({
	children,
	description,
	side = "bottom",
	sideOffset = 0,
}: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent
					sideOffset={sideOffset}
					side={side}
					className="max-w-[220px] break-words text-xs"
				>
					{description}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
