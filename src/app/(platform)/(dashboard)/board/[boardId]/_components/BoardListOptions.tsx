"use client";

import { type ElementRef, useRef } from "react";
import type { BoardList } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/useActions";
import { deleteBoardList } from "@/actions/delete-board-list";
import { copyBoardList } from "@/actions/copy-board-list";

interface BoardListOptionsProps {
    boardList: BoardList;
    onAddCard: () => void;
}

export const BoardListOptions = ({ boardList, onAddCard }: BoardListOptionsProps) => {
    const closeRef = useRef<ElementRef<"button">>(null);

    const { execute: deleteList } = useAction(deleteBoardList, {
        onSuccess: ({ title }) => {
            closeRef?.current?.click();
            toast.success(`List  ${title} deleted`)
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onDelete = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        deleteList({ id, boardId });
    }

    const { execute: copyList } = useAction(copyBoardList, {
        onSuccess: ({ title }) => {
            closeRef?.current?.click();
            toast.success(`List  ${title} copied`)
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onCopy = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        copyList({ id, boardId });
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="ghost">
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4"> 
                    List actions
                </div>
                <PopoverClose 
                    asChild
                    ref={closeRef}
                >
                    <Button 
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" 
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button
                    onClick={onAddCard}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    variant="ghost"
                >
                    Add card
                </Button>
                <form action={onCopy}>
                    <input hidden name="id" id="id" value={boardList.id} />
                    <input hidden name="boardId" id="boardId" value={boardList.boardId} />
                    <FormSubmitButton
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        Copy list
                    </FormSubmitButton>
                </form>
                <Separator />
                <form action={onDelete}>
                    <input hidden name="id" id="id" value={boardList.id} />
                    <input hidden name="boardId" id="boardId" value={boardList.boardId} />
                    <FormSubmitButton
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        Delete list
                    </FormSubmitButton>
                </form>
            </PopoverContent>
        </Popover>
    );
};
