"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFetchUnsplashImages } from "@/hooks/useFetchUnsplashImages";
import Link from "next/link";
import { FormErrors } from "./FormErrors";

interface FormPickerProps {
	id: string;
	errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
	const { pending } = useFormStatus();
	const { images, isLoading } = useFetchUnsplashImages();
	const [selectedImage, setSelectedImage] = useState(null);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-6">
				<Loader2 className="h-6 w-6 animate-spin text-sky-700" />
			</div>
		);
	}

	return (
		<div className="relative">
			<div className="mb-2 grid grid-cols-3 gap-2">
				{images.map((image) => (
					<div
						key={image.id}
						className={cn(
							"group relative aspect-video cursor-pointer bg-muted transition hover:opacity-75",
							pending &&
								"cursor-auto opacity-50 hover:opacity-50",
						)}
						onClick={() => {
							if (pending) return;
							setSelectedImage(image.id);
						}}
					>
						<input
							type="radio"
							id={id}
							name={id}
							className="hidden"
							checked={selectedImage === image.id}
							disabled={pending}
							value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
							readOnly
						/>
						<Image
							src={image.urls.thumb}
							fill
							alt="Unsplash image"
							className="rounded-sm object-cover"
						/>
						{selectedImage === image.id && (
							<div className="absolute inset-y-0 flex h-full w-full items-center justify-center bg-black/30">
								<Check className="h-4 w-4 text-white" />
							</div>
						)}
						<Link
							href={image.links.html}
							target="_blank"
							className="absolute bottom-0 w-full truncate bg-black/50 p-1 text-[10px] text-white opacity-0 hover:underline group-hover:opacity-100"
						>
							{image.user.name}
						</Link>
					</div>
				))}
			</div>
			<FormErrors id="image" errors={errors} />
		</div>
	);
};
