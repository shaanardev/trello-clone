import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

interface MaxWidthWrapperProps extends PropsWithChildren {
	className?: string;
}

const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperProps) => {
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default MaxWidthWrapper;
