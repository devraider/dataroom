import type { DataRoomFile } from "@/types/file";
import { FileCard } from "./FileCard";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useFiles } from "@/hooks/useFiles";
import { EmptyState } from "../common/EmptyState";
import { ImportDialog } from "./ImportDialog";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useWorkspace } from "@/hooks/useWorkspaces";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Grid3x3,
  List,
  MoreVertical,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatBytes, getFileIcon } from "@/lib/utils";
import { FileViewer } from "./FileViewer";
import { fileService } from "@/services/fileService";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { canImportFiles, canDeleteFile } from "@/lib/permissions";

enum ViewMode {
  Grid = "grid",
  List = "list",
}

export default function FileList() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { files, isLoading, deleteFile } = useFiles(
    workspaceId ? Number(workspaceId) : 0
  );
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const user = useAuthStore((state) => state.user);
  const { workspace } = useWorkspace(workspaceId ? Number(workspaceId) : 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Grid);
  const [viewingFile, setViewingFile] = useState<DataRoomFile | null>(null);

  // Check permissions
  const canImport = canImportFiles(user, currentWorkspace);

  // Set current workspace when workspace data is loaded
  useEffect(() => {
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  }, [workspace, setCurrentWorkspace]);

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

  async function handleView(file: DataRoomFile) {
    setViewingFile(file);
  }

  function handleDelete(file: DataRoomFile) {
    if (!canDeleteFile(user, currentWorkspace, file)) {
      toast.error("You don't have permission to delete this file");
      return;
    }

    if (confirm("Are you sure you want to delete this file?")) {
      deleteFile(file.id);
    }
  }

  async function handleDownload(file: DataRoomFile) {
    if (!workspaceId) return;

    try {
      const blob = await fileService.download(Number(workspaceId), file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download file.");
    }
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Files</h2>
          <p className="text-muted-foreground">
            {filteredFiles.length} file(s)
          </p>
        </div>

        <div className="flex items-center border rounded-md p-2 gap-4">
          {files.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === ViewMode.Grid ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(ViewMode.Grid)}
                  className="h-8 w-8 p-0">
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === ViewMode.List ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(ViewMode.List)}
                  className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                </Button>
              </div>
              {canImport && <ImportDialog />}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {files.length > 0 ? (
          filteredFiles.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onView={handleView}
                    onDelete={() => handleDelete(file)}
                    onDownload={() => handleDownload(file)}
                    canDelete={canDeleteFile(user, currentWorkspace, file)}
                  />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-muted/50 px-2 -mx-2 rounded transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatBytes(file.size)} •{" "}
                          {formatDate(file.modifiedAt)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(file)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        {canDeleteFile(user, currentWorkspace, file) && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(file)}
                            className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title="No files found"
              description="Try adjusting your search query"
            />
          )
        ) : (
          <EmptyState
            title="No files yet"
            description={
              canImport
                ? "Import files from Google Drive to get started"
                : "No files available"
            }
            action={canImport ? <ImportDialog /> : undefined}
          />
        )}
      </div>

      {viewingFile && workspaceId && (
        <FileViewer
          workspaceId={Number(workspaceId)}
          fileId={viewingFile.id}
          fileName={viewingFile.name}
          mimeType={viewingFile.mimeType}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
}
