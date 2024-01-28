import type { PropsWithChildren } from "react";

export const ListWrapper = ({ children }: PropsWithChildren) => {
	return (
		<li className="h-full w-[272px] shrink-0 select-none">{children}</li>
	);
};
