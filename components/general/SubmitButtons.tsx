"use client";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
// @ts-ignore - Ignoring the type issue for now
import { useFormStatus } from "react-dom";

interface GeneralSubmitButtonProps {
    text: string;
    variant?: 
    "default" |
    "destructive" |
    "secondary" |
     "outline" |
      "ghost" | 
      "link" |
      null |
      undefined;

    width?: string;

    icon?: React.ReactNode;
}

export function GeneralSubmitButton({ text, variant, width, icon}: GeneralSubmitButtonProps) {
    const { pending } = useFormStatus();
    
    return (
        <Button variant={variant} className={width} disabled={pending}>
            {pending ? (
                <>
                <Loader2 className="size-4 animate-spin" />
                <span>Submitting...</span>
                </>
            ): (
                <>
                {icon && <div>{icon}</div>}
                <span>{text}</span>
                </>
            )}
        </Button>
    );
}