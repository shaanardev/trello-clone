"use client";

import { CardModal } from "@/components/modals/card-modal";
import { useIsMounted } from "usehooks-ts";

interface ModalProviderProps {
 // Define your props here
}

export const ModalProvider = ({}: ModalProviderProps) => {
    const isMounted = useIsMounted();

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CardModal />
        </>
    );
};
