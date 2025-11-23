import type { DataRoomFile } from "@/types/file";
import { FileCard } from "./FileCard";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useFiles } from "@/hooks/useFiles";
import { EmptyState } from "../common/EmptyState";
import { ImportDialog } from "./ImportDialog";

export default function FileList() {
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

        <div className="flex items-center gap-2">
          {files.length > 0 && <ImportDialog />}
        </div>
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
          action={<ImportDialog />}
        />
      )}
    </div>
  );
}
