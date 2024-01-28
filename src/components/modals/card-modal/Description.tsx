"use client";

import { useState } from "react";
import { AlignLeft, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

import type { BoardCardWithList } from "@/types";
import { FormTextarea } from "@/components/forms/FormTextArea";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { updateBoardCard } from "@/actions/board-card/update";
import { useAction } from "@/hooks/useActions";
import { type GenerateCardDescriptionType } from "@/lib/validators/generate-card-description";
import { useEditingFormInput } from "@/hooks/useEditingFormInput";

interface CardModalDescriptionProps {
	card: BoardCardWithList;
}

export const CardModalDescription = ({ card }: CardModalDescriptionProps) => {
	const queryClient = useQueryClient();
	const params = useParams();

	const [text, setText] = useState(card.description);

	const clearTextArea = () => {
		setText(card.description);
	};

	const [formRef, inputRef, isEditing, _, enableEditing, disableEditing] =
		useEditingFormInput<HTMLTextAreaElement>({
			onEnableEditing: () => setTimeout(() => inputRef?.current?.focus()),
			onDisableEditing: clearTextArea,
		});

	const { execute, fieldErrors } = useAction(updateBoardCard, {
		onSuccess: ({ title, description }) => {
			queryClient.invalidateQueries({
				queryKey: ["card", card.id],
			});

			queryClient.invalidateQueries({
				queryKey: ["card-logs", card.id],
			});

			queryClient.invalidateQueries({
				queryKey: ["tokens"],
			});

			toast.success(`Card "${title}" updated`);
			disableEditing();
			setText(description);
		},
		onError: (error) => toast.error(error),
	});

	const { mutate: generateDescription, isPending } = useMutation({
		mutationFn: async ({
			cardId,
			title,
			description,
		}: GenerateCardDescriptionType) => {
			const res = await fetch("/api/ai", {
				method: "POST",
				body: JSON.stringify({ cardId, title, description }),
			});

			if (!res.ok) {
				if (res.status === 429) {
					throw new Error(
						"Too many AI requests, please wait 5 minutes and try again.",
					);
				}
				throw new Error("Failed to generate description");
			}

			return res.body;
		},
		onSuccess: async (stream) => {
			if (!stream) {
				return toast.error(
					"There was a problem generating your description",
				);
			}

			const reader = stream.getReader();
			const decoder = new TextDecoder();
			let done = false;
			let accResponse = "";

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunkValue = decoder.decode(value);

				accResponse += chunkValue;
				setText(accResponse);
			}
		},
		onError: ({ message }) => toast.error(message),
	});

	useOnClickOutside(formRef, disableEditing);

	const onSubmit = (formData: FormData) => {
		const description = formData.get("description") as string;
		const boardId = params.boardId as string;

		execute({ id: card.id, boardId, description });
	};

	const onGenerate = () =>
		generateDescription({
			cardId: card.id,
			title: card.title,
			description: card.description,
		});

	return (
		<div className="flex w-full items-start gap-x-3">
			<AlignLeft className="mt-0.5 h-5 w-5 text-neutral-700" />
			<div className="w-full">
				<p className="mb-2 font-semibold text-neutral-700">
					Description
				</p>
				{isEditing ? (
					<form action={onSubmit} ref={formRef} className="space-y-2">
						<FormTextarea
							id="description"
							ref={inputRef}
							placeholder={
								isPending
									? "Generating..."
									: "Add a more detailed description"
							}
							defaultValue={text || undefined}
							errors={fieldErrors}
							onBlur={clearTextArea}
							resize
							className="mt-2 w-full"
						/>
						<div className="flex items-center gap-x-2">
							<FormSubmitButton>Save</FormSubmitButton>
							<Button
								type="button"
								onClick={onGenerate}
								disabled={isPending}
								size="sm"
								variant="gray"
							>
								<Sparkles className="mr-2 h-4 w-4" />
								Generate
							</Button>
							<Button
								type="button"
								onClick={disableEditing}
								size="sm"
								variant="ghost"
							>
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<div
						role="button"
						onClick={enableEditing}
						className="min-h-[80px] rounded-md bg-neutral-100 px-3.5 py-3 text-sm"
					>
						{text || "Add a more detailed description"}
					</div>
				)}
			</div>
		</div>
	);
};

CardModalDescription.Skeleton = function CardModalDescriptionSkeleton() {
	return (
		<div className="flex w-full items-start gap-x-3">
			<Skeleton className="h-6 w-6 bg-neutral-300" />
			<div className="w-full">
				<Skeleton className="mb-2 h-6 w-24 bg-neutral-300" />
				<Skeleton className="h-[78px] w-full bg-neutral-300" />
			</div>
		</div>
	);
};
