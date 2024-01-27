import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { ModalProvider } from "@/components/providers/ModalProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SubscriptionContextProvider } from "@/components/providers/SubscriptionProvider";
import { checkSubscription } from "@/lib/subscription";
 
const PlatformLayout = async ({ children }: PropsWithChildren) => {
	const isPro = await checkSubscription();

	return (
		<ClerkProvider>
			<QueryProvider>
				<Toaster richColors />
				<ModalProvider />
				<SubscriptionContextProvider isPro={isPro}>
					{children}
				</SubscriptionContextProvider>
			</QueryProvider>
		</ClerkProvider>
	);
};

export default PlatformLayout;
