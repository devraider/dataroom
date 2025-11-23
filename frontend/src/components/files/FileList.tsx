import type { DataRoomFile } from "@/types/file";
import { FileCard } from "./FileCard";
import { useState } from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";

const MOCK_FILES = [
  {
    id: "1",
    name: "Document.pdf",
    size: "2.4 MB",
    uploadedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Spreadsheet.xlsx",
    size: "1.8 MB",
    uploadedAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Presentation.pptx",
    size: "5.2 MB",
    uploadedAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Image.png",
    size: "876 KB",
    uploadedAt: "2024-01-12",
  },
];

function handleView(file: DataRoomFile) {
  console.log("View file:", file);
}

function handleDelete(fileId: number) {
  console.log("Delete file:", fileId);
}

function handleDownload(fileId: number) {
  console.log("Download file:", fileId);
}

export default function FileList() {
  const [selectedFile, setSelectedFile] = useState<DataRoomFile | null>(null);

  if (!MOCK_FILES.length) {
    return <LoadingSpinner text="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Files</h2>
          <p className="text-muted-foreground">1 file(s)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_FILES.map((file) => (
          <FileCard
            key={file.id}
            file={file as any}
            onView={handleView}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        ))}
      </div>
    </div>
  );
}
