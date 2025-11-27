import type { DataRoomFile } from "@/types/file";
import { Card, CardContent } from "../ui/card";
import { formatBytes, formatDate, getFileIcon } from "@/lib/utils";
import { FileActions } from "./FileActions";

export interface FileCardProps {
  file: DataRoomFile;
  onView?: (file: DataRoomFile) => void;
  onDelete?: () => void;
  onDownload?: () => void;
  canDelete?: boolean;
}

export function FileCard({
  file,
  onView,
  onDelete,
  onDownload,
  canDelete = true,
}: FileCardProps) {
  const fileIcon = getFileIcon(file.mimeType);

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{fileIcon}</div>
          <FileActions
            fileId={file.id}
            fileName={file.name}
            webViewLink={file.webViewLink || undefined}
            onView={() => onView?.(file)}
            onDelete={canDelete ? onDelete : undefined}
            onDownload={onDownload}
          />
        </div>

        <div className="space-y-1">
          <h3
            className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors"
            title={file.name}>
            {file.name}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatBytes(file.size)}</span>
            <span>{formatDate(file.modifiedAt)}</span>
          </div>
        </div>

        {file.thumbnailUrl && (
          <div className="mt-3 aspect-video bg-muted rounded-md overflow-hidden">
            <img
              src={file.thumbnailUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
