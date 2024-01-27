"use client";

import { MoreHorizontal, Trash, X, Clipboard } from "lucide-react";
import { toast } from "sonner";

import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger, 
    PopoverClose 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/board/delete";
import { useAction } from "@/hooks/useActions";
import { copyBoard } from "@/actions/board/copy";

interface BoardOptionsProps {
    boardId: string
}

export const BoardOptions = ({ boardId }: BoardOptionsProps) => {
    const {  execute: destroyBoard, isLoading: isDeleting } = useAction(deleteBoard, {
        onError: (error) => toast.error(error)
    });

    const { execute: cloneBoard, isLoading: isCopying } = useAction(copyBoard, {
        onError: (error) => toast.error(error)
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                side="bottom" 
                align="start"
                className="px-0 pt-3 pb-3" 
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Settings
                </div>
                <PopoverClose asChild>
                    <Button 
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>
                <div className="flex flex-col items-center justify-center space-y-3">
                    <Button
                        variant="gray"
                        onClick={() => cloneBoard({ boardId })}
                        disabled={isCopying}
                        className="rounded-sm w-[80%] h-auto p-2 px-5 font-normal text-sm"
                    >
                        <Clipboard className="h-4 w-4 mr-2" />
                        Copy board
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => destroyBoard({ boardId })}
                        disabled={isDeleting}
                        className="rounded-sm w-[80%] h-auto p-2 px-5 font-normal text-sm"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete board
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
