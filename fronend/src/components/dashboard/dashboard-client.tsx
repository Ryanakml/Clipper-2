"use client";

import { useDropzone } from "react-dropzone";
import type { Clip } from "../../../generated/prisma";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState, useCallback, useRef } from "react";
import { generateUploadUrl } from "~/actions/s3";
import { toast } from "sonner";
import { processVideo } from "~/actions/generation";
import { useRouter } from "next/navigation";
import { ClipDisplay } from "./clip-display";
import { cn } from "~/lib/utils";
import { YoutubeLinkPanel } from "./youtube-link-panel";
import { UploadDropzone } from "./upload-dropzone";
import { UploadQueueTable } from "./upload-queue-table";

export type UploadedFileItem = {
  id: string;
  s3Key: string;
  filename: string;
  status: string;
  clipsCount: number;
  createdAt: Date;
  uploadProgress?: number;
  uploaded?: boolean;
};

const DashboardClient = ({
  uploadedFiles,
  clips,
}: {
  uploadedFiles: UploadedFileItem[];
  clips: Clip[];
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploads, setUploads] = useState<UploadedFileItem[]>(uploadedFiles);

  // Ref untuk mengontrol pembatalan upload (AbortController)
  const uploadController = useRef<AbortController | null>(null);
  const currentUploadId = useRef<string | null>(null);

  const router = useRouter();

  // Handle incoming props updates, but keep local "failed" overrides over stale uploading
  useEffect(() => {
    setUploads((prev) => {
      const merged = new Map<string, UploadedFileItem>();
      uploadedFiles.forEach((item) => merged.set(item.id, item));

      prev.forEach((localItem) => {
        const serverItem = merged.get(localItem.id);
        if (!serverItem) {
          merged.set(localItem.id, localItem);
          return;
        }

        if (
          localItem.status === "failed" &&
          serverItem.status === "uploading"
        ) {
          merged.set(localItem.id, {
            ...serverItem,
            status: "failed",
            uploadProgress:
              localItem.uploadProgress ?? serverItem.uploadProgress,
          });
        }
      });

      return Array.from(merged.values());
    });
  }, [uploadedFiles]);

  const handleRefresh = async () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  // --- DROPZONE LOGIC ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.slice(0, 1));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
    maxSize: 500 * 1024 * 1024, // 500MB
    maxFiles: 1,
    disabled: uploading,
    onDropRejected: () => {
      toast.error("File tidak valid", {
        description: "Pastikan format MP4 dan ukuran maksimal 500MB.",
      });
    },
  });

  // Fungsi untuk membatalkan pilihan file SEBELUM upload
  const removeSelectedFile = () => {
    setFiles([]);
  };

  // Fungsi untuk membatalkan upload SAAT proses berjalan
  const cancelUpload = () => {
    if (uploadController.current) {
      uploadController.current.abort(); // Matikan koneksi internet upload
      uploadController.current = null;
    }

    // Update status UI jadi cancelled
    if (currentUploadId.current) {
      const idToCancel = currentUploadId.current;
      setUploads((prev) =>
        prev.map((item) =>
          item.id === idToCancel
            ? { ...item, status: "cancelled", uploadProgress: 0 }
            : item,
        ),
      );
      currentUploadId.current = null;
    }

    setUploading(false);
    toast.info("Upload dibatalkan", {
      description: "Proses unggah video telah dihentikan.",
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const file = files[0]!;
    setUploading(true);

    // Inisialisasi AbortController baru
    const controller = new AbortController();
    uploadController.current = controller;

    let uploadedFileId = "";

    try {
      const {
        success,
        signedUrl,
        uploadedFileId: fileId,
      } = await generateUploadUrl({
        filename: file.name,
        contentType: file.type,
      });

      if (!success) throw new Error("Failed to get upload URL");

      uploadedFileId = fileId;
      currentUploadId.current = fileId;

      // Tambahkan item ke tabel dengan status uploading
      setUploads((prev) => [
        {
          id: uploadedFileId,
          s3Key: "",
          filename: file.name,
          status: "uploading",
          clipsCount: 0,
          createdAt: new Date(),
          uploadProgress: 0,
          uploaded: false,
        },
        ...prev,
      ]);

      // Jalankan upload dengan sinyal abort
      await uploadFileWithProgress(
        signedUrl,
        file,
        (progress) => {
          setUploads((prev) =>
            prev.map((item) =>
              item.id === uploadedFileId
                ? { ...item, uploadProgress: progress }
                : item,
            ),
          );
        },
        controller.signal,
      ); // <-- Pass signal di sini

      // Jika sukses (tidak di-cancel)
      setUploads((prev) =>
        prev.map((item) =>
          item.id === uploadedFileId
            ? {
                ...item,
                status: "uploaded",
                uploadProgress: 100,
                uploaded: true,
              }
            : item,
        ),
      );

      // Trigger pemrosesan AI
      await processVideo(uploadedFileId);

      setUploads((prev) =>
        prev.map((item) =>
          item.id === uploadedFileId ? { ...item, status: "queued" } : item,
        ),
      );

      setFiles([]); // Bersihkan file selection setelah sukses
      currentUploadId.current = null;

      toast.success("Video berhasil diunggah", {
        description:
          "Videomu dijadwalkan untuk diproses. Cek statusnya di bawah.",
        duration: 5000,
      });
    } catch (error: unknown) {
      // Cek apakah error karena user membatalkan (abort)
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message === "Upload cancelled")
      ) {
        // Sudah di-handle di fungsi cancelUpload, jadi skip error toast
        return;
      }

      console.error("Upload error:", error);

      // Update status jadi failed
      setUploads((prev) =>
        prev.map((item) =>
          item.id === uploadedFileId
            ? { ...item, status: "failed", uploadProgress: 0 }
            : item,
        ),
      );

      toast.error("Gagal mengunggah", {
        description: "Ada masalah koneksi atau server. Silakan coba lagi.",
      });
    } finally {
      setUploading(false);
      uploadController.current = null;
    }
  };

  const uploadFileWithProgress = (
    url: string,
    file: File,
    onProgress: (progress: number) => void,
    signal: AbortSignal, // Terima signal
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      // Event listener untuk pembatalan
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error("Upload cancelled"));
      });

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(
            new Error(`Upload failed with status: ${xhr.status.toString()}`),
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during upload"));
      };

      xhr.send(file);
    });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Buat Clip</h1>
          <p className="text-muted-foreground">
            Unggah podcast kamu dan dapatkan clip AI secara instan
          </p>
        </div>
        <Link href="/dashboard/billing">
          <Button>Beli Kredit</Button>
        </Link>
      </div>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="my-clips">Clip Saya</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card className="border-border/60 bg-gradient-to-b from-background via-background to-background">
            <CardHeader>
              <CardTitle>Unggah Podcast</CardTitle>
              <CardDescription>
                Unggah file audio/video atau pakai link YouTube untuk menghasilkan clip.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="file-upload" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="file-upload">File Upload</TabsTrigger>
                  <TabsTrigger value="youtube-link">YouTube Link</TabsTrigger>
                </TabsList>

                <TabsContent value="file-upload" className="space-y-4">
                  <UploadDropzone
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    isDragActive={isDragActive}
                    uploading={uploading}
                    files={files}
                    onRemoveSelected={removeSelectedFile}
                    onCancelUpload={cancelUpload}
                    onUpload={handleUpload}
                    cn={cn}
                  />
                </TabsContent>

                <TabsContent value="youtube-link">
                  <YoutubeLinkPanel />
                </TabsContent>
              </Tabs>

              {uploads.length > 0 && (
                <UploadQueueTable
                  uploads={uploads}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-clips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clip Saya</CardTitle>
              <CardDescription>
                Lihat dan kelola clip yang sudah dihasilkan di sini. Proses bisa
                memakan beberapa menit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClipDisplay clips={clips} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardClient;
