"use client";

import type { Clip } from "~/../generated/prisma/client";
import { Download, Loader2, Play, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";

function ClipCard({ clip }: { clip: Clip }) {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer untuk lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing setelah terlihat
          }
        });
      },
      { rootMargin: "200px" }, // Mulai load 200px sebelum terlihat
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // React Query untuk fetch dan cache URL
  const {
    data: playUrl,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clip-url", clip.id],
    queryFn: async () => {
      const res = await fetch(`/api/clips/${clip.id}/url`);
      if (!res.ok) {
        throw new Error("Failed to load clip");
      }
      const data: unknown = await res.json();
      if (!data || typeof data !== "object") {
        throw new Error("Failed to load clip");
      }
      const record = data as Record<string, unknown>;
      const success = record.success === true;
      const url = typeof record.url === "string" ? record.url : undefined;
      const errorMessage =
        typeof record.error === "string" ? record.error : undefined;
      if (success && url) return url;
      throw new Error(errorMessage ?? "Failed to load clip");
    },
    enabled: isInView, // Only fetch when in viewport
    staleTime: Infinity, // Cache forever
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    retry: 2, // Retry 2 kali jika gagal
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleDownload = () => {
    if (playUrl) {
      const link = document.createElement("a");
      link.href = playUrl;
      link.download = `clip-${clip.id}.mp4`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div ref={cardRef} className="flex flex-col gap-2">
      <div className="bg-muted relative aspect-9/16 overflow-hidden rounded-md">
        {isLoading ? (
          // Skeleton loader yang menarik
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
            <div className="bg-primary/10 rounded-full p-4">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-muted-foreground text-xs font-medium">
                Loading clip...
              </p>
              <p className="text-muted-foreground/60 text-[10px]">
                This may take a moment
              </p>
            </div>
          </div>
        ) : error ? (
          // Error state dengan retry button
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
            <div className="bg-destructive/10 rounded-full p-4">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground text-xs font-medium">
                Failed to load
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="h-7 text-xs"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : playUrl ? (
          // Video player
          <video
            src={playUrl}
            controls
            preload="metadata"
            className="h-full w-full object-cover"
            onError={(e) => {
              console.error("Video playback error:", e);
            }}
          />
        ) : (
          // Placeholder (shouldn't happen, but just in case)
          <div className="flex h-full w-full items-center justify-center">
            <Play className="text-muted-foreground/30 h-10 w-10" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          disabled={!playUrl || isLoading}
          className="w-full"
        >
          <Download className="mr-1.5 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}

export function ClipDisplay({ clips }: { clips: Clip[] }) {
  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="bg-muted rounded-full p-6">
          <Play className="text-muted-foreground/40 h-12 w-12" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-muted-foreground font-medium">Belum ada clip</p>
          <p className="text-muted-foreground/60 text-sm">
            Coba untuk upload dan buat clip baru
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {clips.length} {clips.length === 1 ? "clip" : "clips"} generated
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {clips.map((clip) => (
          <ClipCard key={clip.id} clip={clip} />
        ))}
      </div>
    </div>
  );
}
