"use client"

import { PropsWithChildren } from "react";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover"
import { useAction } from "@/hooks/useActions";
import { createBoard } from "@/actions/create-board";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { FormInput } from "./FormInput";
import { FormSubmitButton } from "./FormSubmitButton";
import { toast } from "sonner";

interface FormPopOverProps extends PropsWithChildren {
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number
}

export const FormPopOver = ({ children, side = "bottom", align, sideOffset = 0 }: FormPopOverProps) => {
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Board created!");
        },
        onError: (error) => {
            toast.error(error);
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        execute({ title })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>    
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create board
                </div>
                <PopoverClose asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                        />
                        
                    </div>
                    <FormSubmitButton className="w-full" >
                        Create
                    </FormSubmitButton>
                </form>
            </PopoverContent>
        </Popover>
    );
};
