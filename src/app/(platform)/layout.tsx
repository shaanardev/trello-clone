import type { PropsWithChildren } from "react";

import { checkSubscription } from "@/lib/subscription";
import { Providers } from "@/components/providers";
import { getAvailableAITokens } from "@/lib/org/ai-tokens-limit";
 
const PlatformLayout = async ({ children }: PropsWithChildren) => {
	const isPro = await checkSubscription();
	const aiTokens = await getAvailableAITokens();

	return (
		<Providers isPro={isPro} aiTokens={aiTokens}>
			{children}
		</Providers>
	);
};

export default PlatformLayout;
