"use client";

import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { ModalProvider } from "@/components/providers/ModalProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SubscriptionContextProvider } from "@/components/providers/SubscriptionProvider";
import { AITokensContextProvider } from "./AITokensProvider";

interface ProvidersProps extends PropsWithChildren {
    isPro: boolean;
    aiTokens: number;
}

export const Providers = ({ isPro, aiTokens, children }: ProvidersProps) => {
    return (
        <ClerkProvider>
            <QueryProvider>
                <Toaster richColors />
                <ModalProvider />
                <SubscriptionContextProvider isPro={isPro}>
                    <AITokensContextProvider aiTokens={aiTokens}>
                        {children}
                    </AITokensContextProvider>
                </SubscriptionContextProvider>
            </QueryProvider>
        </ClerkProvider>
    )
}