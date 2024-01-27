"use client";

import { useRef, type ElementRef, useState } from "react";
import { AlignLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

import type { BoardCardWithList } from "@/types";
import { FormTextarea } from "@/components/forms/FormTextArea";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { updateBoardCard } from "@/actions/board-card/update";
import { useAction } from "@/hooks/useActions";

interface CardModalDescriptionProps {
    card: BoardCardWithList
}

export const CardModalDescription = ({ card }: CardModalDescriptionProps) => {
    const queryClient = useQueryClient();
    const params = useParams();

    const { execute, fieldErrors } = useAction(updateBoardCard, {
        onSuccess: ({ title }) => {
            queryClient.invalidateQueries({
                queryKey: ["card", card.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["card-logs", card.id]
            });

            toast.success(`Card "${title}" updated`);
            disableEditing();
        },
        onError: (error) => toast.error(error)
    });
 
    const textareaRef = useRef<ElementRef<"textarea">>(null);
    const formRef = useRef<ElementRef<"form">>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef?.current?.focus();
        })
    }

    const disableEditing = () => setIsEditing(false);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        };
    };
    
    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;
        
        execute({ id: card.id, boardId, description });
    }

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Description
                </p>
                {isEditing ? (
                    <form
                        action={onSubmit}
                        ref={formRef}
                        className="space-y-2"
                    >
                        <FormTextarea 
                            id="description"
                            ref={textareaRef}
                            placeholder="Add a more detailed description"
                            defaultValue={card.description || undefined}
                            errors={fieldErrors}
                            className="w-full mt-2"
                        />
                        <div className="flex items-center gap-x-2">
                            <FormSubmitButton>
                                Save
                            </FormSubmitButton>
                            <Button
                                type="button"
                                onClick={disableEditing}
                                size="sm"
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        role="button"
                        onClick={enableEditing}
                        className="min-h-[78px] bg-neutral-300 text-sm font-medium py-3 px-3.5 rounded-md"
                    >
                        {card.description || "Add a more detailed description"}
                    </div>
                )}
            </div>
        </div>
    );
};

CardModalDescription.Skeleton = function CardModalDescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-300" />
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2 bg-neutral-300" />
                <Skeleton className="w-full h-[78px] bg-neutral-300" />
            </div>
        </div>
    );
};
