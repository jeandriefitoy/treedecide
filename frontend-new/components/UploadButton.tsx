"use client";

import { useRef } from "react";
import { RefreshCw, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  variant?: "default" | "change";
  accept?: string;
  className?: string;
  onSelect: (file: File) => void;
}

export default function UploadButton({
  variant = "default",
  accept = ".csv,.xlsx,.xls",
  className,
  onSelect,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onSelect(file);

    // memungkinkan memilih file yang sama lagi
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      <Button
        type="button"
        variant={variant === "default" ? "default" : "secondary"}
        onClick={handleBrowse}
        className={cn(className)}
      >
        {variant === "default" ? (
          <>
            <Upload className="h-4 w-4" />
            Browse File
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Change File
          </>
        )}
      </Button>
    </>
  );
}