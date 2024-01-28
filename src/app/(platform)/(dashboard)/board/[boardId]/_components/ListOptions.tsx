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
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/useActions";
import { deleteBoardList } from "@/actions/board-list/delete";
import { copyBoardList } from "@/actions/board-list/copy";

interface BoardListOptionsProps {
	boardList: BoardList;
	onAddCard: () => void;
}

export const BoardListOptions = ({
	boardList,
	onAddCard,
}: BoardListOptionsProps) => {
	const closeRef = useRef<ElementRef<"button">>(null);

	const { execute: deleteList } = useAction(deleteBoardList, {
		onSuccess: ({ title }) => {
			closeRef?.current?.click();
			toast.success(`List  ${title} deleted`);
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onDelete = (formData: FormData) => {
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		deleteList({ id, boardId });
	};

	const { execute: copyList } = useAction(copyBoardList, {
		onSuccess: ({ title }) => {
			closeRef?.current?.click();
			toast.success(`List  ${title} copied`);
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onCopy = (formData: FormData) => {
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		copyList({ id, boardId });
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="h-auto w-auto p-2" variant="ghost">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="px-0 pb-3 pt-3"
				side="bottom"
				align="start"
			>
				<div className="pb-4 text-center text-sm font-medium text-neutral-600">
					List actions
				</div>
				<PopoverClose asChild ref={closeRef}>
					<Button
						variant="ghost"
						className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<Button
					onClick={onAddCard}
					className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
					variant="ghost"
				>
					Add card
				</Button>
				<form action={onCopy}>
					<input hidden name="id" id="id" value={boardList.id} />
					<input
						hidden
						name="boardId"
						id="boardId"
						value={boardList.boardId}
					/>
					<FormSubmitButton
						variant="ghost"
						className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
					>
						Copy list
					</FormSubmitButton>
				</form>
				<Separator />
				<form action={onDelete}>
					<input hidden name="id" id="id" value={boardList.id} />
					<input
						hidden
						name="boardId"
						id="boardId"
						value={boardList.boardId}
					/>
					<FormSubmitButton
						variant="ghost"
						className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
					>
						Delete list
					</FormSubmitButton>
				</form>
			</PopoverContent>
		</Popover>
	);
};
