"use client";

import { useDropzone } from "react-dropzone";
import { cn } from "~/lib/utils";

export function Dropzone({
  onDrop,
  className,
}: {
  onDrop: (files: File[]) => void;
  className?: string;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex h-36 cursor-pointer items-center justify-center rounded-md border border-dashed text-sm transition-colors",
        isDragActive && "bg-accent",
        className,
      )}
    >
      <input {...getInputProps()} />
      Drop file here
    </div>
  );
}
