"use client";

import { BoardList } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

import { useEditingFormInput } from "@/hooks/useEditingFormInput";
import { FormInput } from "@/components/forms/FormInput";
import { useAction } from "@/hooks/useActions";
import { updateBoardList } from "@/actions/board-list/update";
import { BoardListOptions } from "./ListOptions";

interface BoardListHeaderProps {
	boardList: BoardList;
	onAddCard: () => void;
}

export const BoardListHeader = ({
	boardList,
	onAddCard,
}: BoardListHeaderProps) => {
	const [formRef, inputRef, isEditing, _, enableEditing, disableEditing] =
		useEditingFormInput<HTMLInputElement>({
			onEnableEditing: () => {
				setTimeout(() => {
					inputRef.current?.focus();
					inputRef.current?.select();
				});
			},
		});
	const [boardTitle, setBoardTitle] = useState<string>(boardList.title);

	const { execute } = useAction(updateBoardList, {
		onSuccess: ({ title }) => {
			toast.success(`Renamed to ${title}`);
			setBoardTitle(title);
			disableEditing();
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		if (title === boardList.title) {
			return disableEditing();
		}

		execute({ id, boardId, title });
	};

	const onBlur = () => {
		formRef?.current?.requestSubmit();
	};

	return (
		<div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
			{isEditing ? (
				<form
					ref={formRef}
					action={onSubmit}
					className="flex-1 px-[2px]"
				>
					<input hidden id="id" name="id" value={boardList.id} />
					<input
						hidden
						id="boardId"
						name="boardId"
						value={boardList.boardId}
					/>
					<FormInput
						ref={inputRef}
						onBlur={onBlur}
						id="title"
						placeholder="Enter list title"
						defaultValue={boardTitle}
						className="h-7 truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium transition hover:border-input focus:border-input focus:bg-white"
					/>
					<button type="submit" hidden />
				</form>
			) : (
				<div
					onClick={enableEditing}
					className="h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium"
				>
					{boardTitle}
				</div>
			)}
			<BoardListOptions onAddCard={onAddCard} boardList={boardList} />
		</div>
	);
};
