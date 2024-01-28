"use client";

import {
	type ElementRef,
	forwardRef,
	useRef,
	type KeyboardEventHandler,
} from "react";
import { useParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { FormTextarea } from "@/components/forms/FormTextArea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useActions";
import { createCard } from "@/actions/board-card/create";
import { toast } from "sonner";

interface BoardCardFormProps {
	boardListId: string;
	isEditing: boolean;
	enableEditing: () => void;
	disableEditing: () => void;
}

export const BoardCardForm = forwardRef<
	HTMLTextAreaElement,
	BoardCardFormProps
>(({ boardListId, isEditing, enableEditing, disableEditing }, ref) => {
	const params = useParams();
	const formRef = useRef<ElementRef<"form">>(null);

	const { execute, fieldErrors } = useAction(createCard, {
		onSuccess: ({ title }) => {
			toast.success(`Card "${title}" succesfully created`);
			formRef?.current?.reset();
		},
		onError: (errors) => toast.error(errors),
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			disableEditing();
		}
	};

	useEventListener("keydown", onKeyDown);
	useOnClickOutside(formRef, disableEditing);

	const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			formRef.current?.requestSubmit();
		}
	};

	const onSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		const boardListId = formData.get("boardListId") as string;
		const boardId = params.boardId as string;

		execute({ title, boardListId, boardId });
	};

	if (isEditing) {
		return (
			<form
				ref={formRef}
				action={onSubmit}
				className="m-1 space-y-4 px-1 py-0.5"
			>
				<FormTextarea
					ref={ref}
					id="title"
					placeholder="Enter a title for this card..."
					onKeyDown={onTextareakeyDown}
					errors={fieldErrors}
				/>
				<input
					hidden
					readOnly
					id="boardListId"
					name="boardListId"
					value={boardListId}
				/>
				<div className="flex items-center gap-x-1">
					<FormSubmitButton>Add card</FormSubmitButton>
					<Button onClick={disableEditing} size="sm" variant="ghost">
						<X className="h-5 w-5" />
					</Button>
				</div>
			</form>
		);
	}

	return (
		<div className="px-2 pt-2">
			<Button
				onClick={enableEditing}
				className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground"
				size="sm"
				variant="ghost"
			>
				<Plus className="mr-2 h-4 w-4" />
				Add a card
			</Button>
		</div>
	);
});

BoardCardForm.displayName = "CardForm";
