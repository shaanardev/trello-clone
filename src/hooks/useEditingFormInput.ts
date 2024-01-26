import { useRef, useState, type ElementRef } from "react";
import { useEventListener } from "usehooks-ts";

interface UseEditingFormInputOptions {
    onEnableEditing?: () => void;
    onDisableEditing?: () => void;
}

export const useEditingFormInput = (options?: UseEditingFormInputOptions) => {
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        };
    };

    useEventListener("keydown", onKeyDown);

    const enableEditing = () => {
        setIsEditing(true);
        options?.onEnableEditing?.();
    }
    const disableEditing = () => { 
        setIsEditing(false);
        options?.onDisableEditing?.();
    }

    return [
        formRef,
        inputRef,
        isEditing,
        setIsEditing,
        enableEditing,
        disableEditing
    ] as const;
}