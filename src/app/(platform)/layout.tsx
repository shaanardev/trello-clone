import type { PropsWithChildren } from "react";

import { checkSubscription } from "@/lib/subscription";
import { Providers } from "@/components/providers";
import { getAvailableAITokens } from "@/lib/org/ai-tokens-limit";
 
const PlatformLayout = async ({ children }: PropsWithChildren) => {
	const isPro = await checkSubscription();

	return (
		<Providers isPro={isPro}>
			{children}
		</Providers>
	);
};

export default PlatformLayout;
