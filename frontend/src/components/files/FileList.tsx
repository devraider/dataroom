import type { DataRoomFile } from "@/types/file";
import { FileCard } from "./FileCard";
import { useState } from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useFiles } from "@/hooks/useFiles";
import { EmptyState } from "../common/EmptyState";
import { ImportDialog } from "./ImportDialog";

const MOCK_FILES: DataRoomFile[] = [
  {
    id: 1,
    name: "Document.pdf",
    size: 2400000,
    createdAt: new Date("2024-01-15").toISOString(),
    modifiedAt: new Date("2024-01-16").toISOString(),
    mimeType: "application/pdf",
    googleDriveId: "doc-1234-abcd",
    thumbnailUrl: "https://placehold.co/150",
    webViewLink: "http://localhost:5173/files/document-pdf",
  },
  {
    id: 2,
    name: "Spreadsheet.xlsx",
    size: 1800000,
    createdAt: new Date("2024-01-14").toISOString(),
    modifiedAt: new Date("2024-01-15").toISOString(),
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    googleDriveId: "sheet-5678-efgh",
    thumbnailUrl: "https://placehold.co/150",
    webViewLink: "http://localhost:5173/files/spreadsheet-xlsx",
  },
  {
    id: 3,
    name: "Presentation.pptx",
    size: 5200000,
    createdAt: new Date("2024-01-13").toISOString(),
    modifiedAt: new Date("2024-01-14").toISOString(),
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    googleDriveId: "ppt-9012-ijkl",
    thumbnailUrl: "https://placehold.co/150",
    webViewLink: "http://localhost:5173/files/presentation-pptx",
  },
  {
    id: 4,
    name: "Image.png",
    size: 876000,
    createdAt: new Date("2024-01-12").toISOString(),
    modifiedAt: new Date("2024-01-13").toISOString(),
    mimeType: "image/png",
    googleDriveId: "img-3456-mnop",
    thumbnailUrl: "https://placehold.co/150",
    webViewLink: "http://localhost:5173/files/image-png",
  },
];

export default function FileList() {
  const [selectedFile, setSelectedFile] = useState<DataRoomFile | null>(null);
  const { files, isLoading, deleteFile } = useFiles();

  function handleView(file: DataRoomFile) {
    console.log("View file:", file);
  }

  function handleDelete(fileId: number) {
    if (confirm("Are you sure you want to delete this file?")) {
      deleteFile(fileId);
    }
  }

  function handleDownload(fileId: number) {
    console.log("Download file:", fileId);
  }
  if (isLoading) {
    return <LoadingSpinner text="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Files</h2>
          <p className="text-muted-foreground">{files.length} file(s)</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ImportDialog />
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onView={handleView}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No files yet"
          description="Import files from Google Drive to get started"
        />
      )}
    </div>
  );
}
