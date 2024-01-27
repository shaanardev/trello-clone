"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Trash, X, Clipboard, Infinity } from "lucide-react";
import { toast } from "sonner";
import { formatDuration, intervalToDuration } from "date-fns";

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
import { useSubscriptionContext } from "@/components/providers/SubscriptionProvider";
import { Hint } from "@/components/Hint";
import { useAITokensContext } from "@/components/providers/AITokensProvider";
import { MAX_FREE_AI_TOKENS } from "@/constants/limits";


const calculateTimeLeft = () => {
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
     
    const duration = intervalToDuration({
       start: now,
       end: nextHour
    });

    if (duration.minutes && duration.minutes <= 10) {
        return formatDuration(duration, {
            format: ['minutes', 'seconds'],
            zero: false,
            delimiter: ", "
        }).replace('minutes', 'mins').replace('seconds', 'secs');;
    }

    if (duration.seconds) {
        if (duration.minutes && duration.minutes <= 10) {
            return formatDuration(duration, {
                format: ['seconds'],
                zero: false,
            }).replace('seconds', 'secs');
        }
    }
   
    return formatDuration(duration, {
        format: ['minutes'],
        zero: false,
     }).replace('seconds', 'secs');;
};

interface BoardOptionsProps {
    boardId: string
}

export const BoardOptions = ({ boardId }: BoardOptionsProps) => {
    const isPro = useSubscriptionContext();
    const aiTokens = useAITokensContext();

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            const time = calculateTimeLeft();
            setTimeLeft(time);
        }, 1000);
      
        return () => clearTimeout(timer);
    });

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
                    <div className="rounded-sm w-[80%] h-auto p-2 text-sm flex items-center justify-between">
                        <span className="font-semibold">AI Tokens:</span>
                        <span >
                            <Hint 
                                description={isPro ? "Unlimited tokens" : `Resets in ${timeLeft}`}
                                sideOffset={15}
                            >
                                {isPro ? 
                                    <Infinity className="h-4 w-4" /> 
                                : 
                                    <span className={aiTokens && aiTokens === 0 ? "text-red-500" : "text-normal"}>
                                        {`${MAX_FREE_AI_TOKENS - aiTokens} remaining`}
                                    </span>
                                }
                            </Hint>
                        </span>
                    </div>
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
