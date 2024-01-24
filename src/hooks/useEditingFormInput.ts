import { useRef, useState, type ElementRef, type RefObject } from "react";

export const useEditingFormInput = () => {
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    return [
        formRef,
        inputRef,
        isEditing,
        setIsEditing
    ] as const;
}