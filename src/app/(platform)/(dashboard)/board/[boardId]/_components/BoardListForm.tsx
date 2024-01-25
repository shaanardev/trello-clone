"use client";

import { useOnClickOutside } from "usehooks-ts";
import { useParams, useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { ListWrapper } from "@/components/ListWrapper";
import { useEditingFormInput } from "@/hooks/useEditingFormInput";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { useAction } from "@/hooks/useActions";
import { createBoardList } from "@/actions/create-board-list";
import { toast } from "sonner";

export const BoardListForm = () => {
    const router = useRouter();
    const params = useParams();
    
    const [formRef, inputRef, isEditing, _, enableEditing, disableEditing] = useEditingFormInput({
        onEnableEditing: () => {
            setTimeout(() => {
                inputRef.current?.focus();
            });
        }
    });

    useOnClickOutside(formRef, disableEditing);

    const { execute, fieldErrors } = useAction(createBoardList, {
        onSuccess: ({ title }) => {
            toast.success(`List "${title}" created`);
            disableEditing();
            router.refresh();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;

        execute({ title, boardId });
    }

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    action={onSubmit}
                    ref={formRef}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                >
                    <FormInput
                        id="title"
                        ref={inputRef}
                        errors={fieldErrors}
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                        placeholder="Enter list title..."    
                    />
                    <input
                        hidden
                        value={params.boardId}
                        name="boardId"
                    />
                    <div className="flex items-center gap-x-1">
                        <FormSubmitButton>
                            Add list
                        </FormSubmitButton>
                        <Button 
                            onClick={disableEditing}
                            size="sm"
                            variant="ghost"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>    
                </form>    
            </ListWrapper>
        )
    }

    return (
        <ListWrapper>
            <button 
                onClick={enableEditing}
                className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add a list
            </button>    
        </ListWrapper>
    );
};
