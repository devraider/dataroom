import type { DataRoomFile } from "@/types/file";

export interface FileCardProps {
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
  return <div>{file.name}</div>;
}
