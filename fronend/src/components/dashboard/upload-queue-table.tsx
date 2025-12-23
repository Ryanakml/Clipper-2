import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";
import type { UploadedFileItem } from "./dashboard-client";

export function UploadQueueTable({
  uploads,
  refreshing,
  onRefresh,
}: {
  uploads: UploadedFileItem[];
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="pt-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="mb-2 text-base font-medium">Status antrean</h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
          {refreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Muat ulang
        </Button>
      </div>
      <div className="max-h-100 overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Diunggah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Clip dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-xs truncate font-medium">
                  {item.filename}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {item.status === "uploading" ? (
                    <div className="min-w-35 space-y-2">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>Mengunggah...</span>
                        <span className="font-mono">
                          {item.uploadProgress ?? 0}%
                        </span>
                      </div>
                      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${item.uploadProgress ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {item.status === "queued" && (
                        <Badge
                          variant="outline"
                          className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                        >
                          Menunggu
                        </Badge>
                      )}
                      {item.status === "uploaded" && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
                        >
                          Diunggah
                        </Badge>
                      )}
                      {item.status === "processing" && (
                        <Badge
                          variant="outline"
                          className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50"
                        >
                          Memproses
                        </Badge>
                      )}
                      {item.status === "processed" && (
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
                        >
                          Selesai
                        </Badge>
                      )}
                      {item.status === "cancelled" && (
                        <Badge
                          variant="outline"
                          className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50"
                        >
                          Dibatalkan
                        </Badge>
                      )}
                      {item.status === "failed" && (
                        <Badge variant="destructive">Gagal</Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {item.clipsCount > 0 ? (
                    <span>{item.clipsCount} clip</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
