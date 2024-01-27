"use client";

import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/useCardModal";
import type { BoardCardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { CardModalHeader } from "./Header";
import { CardModalDescription } from "./Description";
import { CardModalActions } from "./Actions";

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
                    <CardModal.Skeleton />
                ):  
                    <>
                        <CardModalHeader card={card} />
                        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                            <div className="col-span-3">
                                <div className="w-full space-y-6">
                                    <CardModalDescription card={card} />
                                </div>
                            </div>
                            <CardModalActions card={card} />
                        </div>
                    </>        
                }
            </DialogContent>        
        </Dialog>
    );
};

CardModal.Skeleton = function CardModalSkeleton() {
    return (
        <>
            <CardModalHeader.Skeleton />
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                <div className="col-span-3">
                    <div className="w-full space-y-6">
                        <CardModalDescription.Skeleton />
                    </div>
                </div>
                <CardModalActions.Skeleton />
            </div>
        </>
    );
};
