"use client"

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
                <Loader2 className="h-6 w-6 text-sky-700 animate-spin"/>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image) => (
                    <div 
                        key={image.id}
                        className={cn(
                            "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                            pending && "opacity-50 hover:opacity-50 cursor-auto"
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
                            className="object-cover rounded-sm"
                        />
                        {selectedImage === image.id && (
                            <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-black/30">
                                <Check className="h-4 w-4 text-white"/>
                            </div>
                        )}
                        <Link
                            href={image.links.html}
                            target="_blank"
                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                        >
                            {image.user.name}
                        </Link>
                    </div>
                ))}
            </div>
            <FormErrors
                id="image"
                errors={errors}
            />
        </div>
    );
};
