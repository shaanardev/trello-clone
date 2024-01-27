"use client";

import { toast } from "sonner";

import { stripeRedirect } from "@/actions/stripe/redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useActions";
import { useProModal } from "@/hooks/useProModal";
import { useSubscriptionContext } from "@/components/providers/SubscriptionProvider";

export const SubscriptionButton = () => {
    const proModal = useProModal();
    const isPro = useSubscriptionContext();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (url) => window.location.href = url,
        onError: (error) => toast.error(error)
    });

    const onClick = () => {
        if (isPro) {
            execute({});
        } else {
            proModal.onOpen();
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            variant="primary"
        >
            {isPro ? "Manage subscription" : "Upgrade to pro"}
        </Button>
    );
};
