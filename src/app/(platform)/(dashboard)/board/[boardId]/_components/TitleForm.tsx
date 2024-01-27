"use client";

import { useState } from "react";
import { type Board } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import { updateBoard } from "@/actions/board/update";
import { useAction } from "@/hooks/useActions";
import { useEditingFormInput } from "@/hooks/useEditingFormInput";

interface BoardTitleFormProps {
    board: Board
}

export const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
    const {  execute } = useAction(updateBoard, {
        onSuccess: ({ title }) => {
            toast.success(`Board "${title}" updated!`);
            setTitle(title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const [title, setTitle] = useState<string>(board.title);
    const [formRef, inputRef, isEditing, _, enableEditing, disableEditing] = useEditingFormInput<HTMLInputElement>({
        onEnableEditing: () => {
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            })
        }
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        if (title === board.title) {
            return disableEditing();
        }

        execute({ 
            title, 
            id: board.id 
        });
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    if (isEditing) {
        return (
            <form 
                ref={formRef}
                action={onSubmit}
                className="flex items-center gap-x-2"
            >
                <FormInput
                    id="title"
                    ref={inputRef}
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }

    return (
        <Button 
            variant="transparent"
            className="font-bold text-lg h-auto w-auto p-1 px-2"
            onClick={enableEditing}
        >
            {title}
        </Button>
    );
};