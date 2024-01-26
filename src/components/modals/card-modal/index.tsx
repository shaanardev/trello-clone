"use client";

import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/useCardModal";
import type { BoardCardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { CardModalHeader } from "./Header";

interface CardModalProps {
 // Define your props here
}

export const CardModal = ({}: CardModalProps) => {
    const id = useCardModal((state) => state.id);
    const isOpen = useCardModal((state) => state.isOpen);
    const onClose = useCardModal((state) => state.onClose);

    const { data: card } = useQuery<BoardCardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`)
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                {!card ? (
                    <CardModalHeader.Skeleton />
                ):  
                    <CardModalHeader 
                        card={card}
                    />
                }
            </DialogContent>        
        </Dialog>
    );
};
