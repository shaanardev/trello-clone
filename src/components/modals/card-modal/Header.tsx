"use client";

import { type ElementRef, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { FormInput } from "@/components/forms/FormInput";
import { Skeleton } from "@/components/ui/skeleton";
import type { BoardCardWithList } from "@/types";
import { useAction } from "@/hooks/useActions";
import { updateBoardCard } from "@/actions/board-card/update";
import { CARD_LOGS_QK, CARD_QK } from "@/constants/query-keys";

interface CardModalHeaderProps {
	card: BoardCardWithList;
}

export const CardModalHeader = ({ card }: CardModalHeaderProps) => {
	const queryClient = useQueryClient();
	const params = useParams();
	const { execute } = useAction(updateBoardCard, {
		onSuccess: ({ title }) => {
			queryClient.invalidateQueries({
				queryKey: [CARD_QK, card.id],
			});

			queryClient.invalidateQueries({
				queryKey: [CARD_LOGS_QK, card.id],
			});

			setTitle(title);
			toast.success(`Card renamed to "${title}"`);
		},
		onError: (error) => toast.error(error),
	});

	const inputRef = useRef<ElementRef<"input">>(null);
	const [title, setTitle] = useState<string | undefined>(card.title);

	const onBlur = () => inputRef?.current?.form?.requestSubmit();

	const onSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		const boardId = params.boardId as string;
		if (title === card.title) {
			return;
		}

		execute({ id: card.id, title, boardId });
	};

	return (
		<div className="mb-6 flex w-full items-start gap-x-3">
			<LayoutIcon className="mt-1 h-5 w-5 text-neutral-700" />
			<div className="w-full">
				<form action={onSubmit}>
					<FormInput
						id="title"
						defaultValue={title}
						ref={inputRef}
						onBlur={onBlur}
						className="relative -left-1.5 mb-0.5 w-[95%] truncate border-transparent bg-transparent px-1 text-xl font-semibold text-neutral-700 focus-visible:border-input focus-visible:bg-white"
					/>
				</form>
				<p className="text-sm text-muted-foreground">
					in list{" "}
					<span className="underline">{card.boardList.title}</span>
				</p>
			</div>
		</div>
	);
};

CardModalHeader.Skeleton = function CardModalHeaderSkeleton() {
	return (
		<div className="mb-6 flex items-start gap-x-3">
			<Skeleton className="mt-1 h-6 w-6 bg-neutral-300" />
			<div>
				<Skeleton className="mb-1 h-6 w-24 bg-neutral-300" />
				<Skeleton className="h-4 w-12 bg-neutral-300" />
			</div>
		</div>
	);
};
