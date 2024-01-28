"use client";

import { forwardRef, type KeyboardEventHandler } from "react";
import { useFormStatus } from "react-dom";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./FormErrors";

interface FormTextAreaProps {
	id: string;
	label?: string;
	placeholder?: string;
	defaultValue?: string;
	required?: boolean;
	disabled?: boolean;
	resize?: boolean;
	errors?: Record<string, string[] | undefined>;
	className?: string;
	onClick?: () => void;
	onBlur?: () => void;
	onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement | undefined>;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
	(
		{
			id,
			label,
			placeholder,
			defaultValue,
			required,
			disabled,
			resize = false,
			errors,
			className,
			onClick,
			onBlur,
			onKeyDown,
		},
		ref,
	) => {
		const { pending } = useFormStatus();

		return (
			<div className="w-full space-y-2">
				<div className="w-full space-y-1">
					{label ? (
						<Label
							htmlFor={id}
							className="text-xs font-semibold text-neutral-700"
						>
							{label}
						</Label>
					) : null}
					<Textarea
						id={id}
						name={id}
						ref={ref}
						placeholder={placeholder}
						defaultValue={defaultValue}
						required={required}
						disabled={pending || disabled}
						onClick={onClick}
						onBlur={onBlur}
						onKeyDown={onKeyDown}
						className={cn(
							"shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
							resize ? "" : "resize-none",
							className,
						)}
						aria-describedby={`${id}-error`}
					/>
				</div>
				<FormErrors id={id} errors={errors} />
			</div>
		);
	},
);

FormTextarea.displayName = "FormTextArea";
