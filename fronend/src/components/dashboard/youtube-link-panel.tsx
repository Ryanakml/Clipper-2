import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

export function YoutubeLinkPanel() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [processingLink, setProcessingLink] = useState(false);

  const handleYoutubeLink = async () => {
    if (!youtubeLink.trim()) {
      toast.error("Tempel link YouTube dulu.");
      return;
    }
    setProcessingLink(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.info("Fitur link YouTube segera hadir", {
      description: "Fitur ini akan dipakai begitu fitur siap.",
    });
    setProcessingLink(false);
  };

  return (
    <div className="border-border/60 bg-muted/40 ring-primary/10 flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">
          Tempel URL YouTube
        </label>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            disabled={processingLink}
            className="md:flex-1"
          />
          <Button
            type="button"
            size="lg"
            onClick={handleYoutubeLink}
            disabled={processingLink}
            className="md:w-auto"
          >
            {processingLink && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Proses link
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Mendukung video atau playlist publik/unlisted. Durasi maksimal 2 jam
          per video.
        </p>
      </div>

      {/* <div className="flex flex-wrap gap-2">
        {[
          { icon: Link2, label: "URL publik / unlisted" },
          { icon: Wand2, label: "Highlight otomatis" },
          { icon: Clock3, label: "< 2 jam per video" },
          { icon: ShieldCheck, label: "Privasi terjamin" },
        ].map((item) => (
          <Badge
            key={item.label}
            variant="outline"
            className="bg-background/60 text-muted-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Badge>
        ))}
      </div> */}
    </div>
  );
}
