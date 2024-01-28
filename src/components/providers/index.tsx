"use client";

import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { ModalProvider } from "@/components/providers/ModalProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SubscriptionContextProvider } from "@/components/providers/SubscriptionProvider";

interface ProvidersProps extends PropsWithChildren {
	isPro: boolean;
}

export const Providers = ({ isPro, children }: ProvidersProps) => {
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
