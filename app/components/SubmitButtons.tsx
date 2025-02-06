"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  className?: string;
  loading?: boolean;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export function SubmitButton({
  text,
  className,
  loading,
  variant,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const isLoading = loading || pending;

  return (
    <>
      {isLoading ? (
        <Button disabled className={cn("w-fit", className)} variant={variant}>
          <Loader2 className="mr-2 size-4 animate-spin" /> Please wait
        </Button>
      ) : (
        <Button
          className={cn("w-fit", className)}
          variant={variant}
          type="submit"
        >
          {text}
        </Button>
      )}
    </>
  );
}

export default SubmitButton;
