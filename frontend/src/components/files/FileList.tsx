import type { DataRoomFile } from "@/types/file";
import { Card, CardContent } from "../ui/card";

interface FileCardProps {
  file: DataRoomFile;
  onView?: (file: DataRoomFile) => void;
  onDelete?: (fileId: number) => void;
  onDownload?: (fileId: number) => void;
}

export function FileCard({
  file,
  onView,
  onDelete,
  onDownload,
}: FileCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">{file.name}</CardContent>
    </Card>
  );
}
