import { Button } from "../ui/button";
import { FileVideo, UploadCloud, X } from "lucide-react";
import type { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import type { ClassValue } from "clsx";

export function UploadDropzone({
  getRootProps,
  getInputProps,
  isDragActive,
  uploading,
  files,
  onRemoveSelected,
  onCancelUpload,
  onUpload,
  cn,
}: {
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  isDragActive: boolean;
  uploading: boolean;
  files: File[];
  onRemoveSelected: () => void;
  onCancelUpload: () => void;
  onUpload: () => void;
  cn: (...inputs: ClassValue[]) => string;
}) {
  return (
    <>
      <div className="w-full">
        <div
          {...getRootProps()}
          className={cn(
            "border-border bg-muted/40 hover:bg-muted/60 flex min-h-60 w-full cursor-pointer flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all",
            isDragActive &&
              "border-primary/60 bg-primary/5 ring-primary/20 ring-2",
            uploading && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="text-muted-foreground h-12 w-12" />
          <div className="space-y-1">
            <p className="font-semibold">Drag and drop your file</p>
            <p className="text-muted-foreground text-sm">
              or click to browse (MP4 up to 500MB)
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={uploading}
          >
            Select File
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-muted/50 animate-in fade-in slide-in-from-top-2 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-background rounded-md border p-2">
              <FileVideo className="text-primary h-5 w-5" />
            </div>
            <div className="space-y-1 overflow-hidden text-sm">
              <p className="max-w-50 truncate font-medium sm:max-w-xs">
                {files[0]?.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {(files[0]!.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            {!uploading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemoveSelected}
                className="text-muted-foreground hover:text-destructive"
                title="Hapus file"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {uploading ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onCancelUpload}
                className="min-w-35"
              >
                <X className="mr-2 h-4 w-4" />
                Batalkan
              </Button>
            ) : (
              <Button type="button" onClick={onUpload} className="min-w-35">
                Upload dan Buat Clip
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
