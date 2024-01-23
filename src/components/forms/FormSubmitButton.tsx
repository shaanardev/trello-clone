"use client";

import type { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variants = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
interface FormSubmitProps extends PropsWithChildren {
    disabled?: boolean;
    className?: string;
    variant?: Variants
}

export const FormSubmitButton = ({children, variant, className, disabled}: FormSubmitProps) => {
    const { pending } = useFormStatus();
    
    return (
        <Button
            type="submit"
            variant={variant}
            size="sm"
            className={cn(className)}
            disabled={pending || disabled}
        >
            {children}
        </Button>
    );
};
