import type { GoogleDriveFile } from "@/lib/googleDrive";
import { cn, getFileIcon, isFolder } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Folder,
  Home,
  Loader2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface GoogleDriveFileBrowserProps {
  accessToken: string;
  onSelectFiles: (files: GoogleDriveFile[]) => void;
  selectedFiles: GoogleDriveFile[];
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export function GoogleDriveFileBrowser({
  accessToken,
  onSelectFiles,
  selectedFiles,
}: GoogleDriveFileBrowserProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "root", name: "My Drive" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState("root");

  useEffect(() => {
    if (isSearching) return;

    const loadFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await listGoogleDriveFiles(accessToken, currentFolderId);
        setFiles(result);
      } catch (err) {
        console.error("Error loading files:", err);
        setError(err instanceof Error ? err.message : "Failed to load files");
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [accessToken, currentFolderId, isSearching]);

  async function searchGoogleDriveFiles(
    accessToken: string,
    searchQuery: string
  ): Promise<GoogleDriveFile[]> {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = `name contains '${searchQuery
      .replace(/'/g, "\\'")
      .trim()}' and trashed=false`;

    const params = new URLSearchParams({
      q: query,
      fields:
        "files(id,name,mimeType,size,iconLink,thumbnailLink,webViewLink,modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: "50",
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  }

  async function listGoogleDriveFiles(
    accessToken: string,
    folderId: string = "root",
    searchQuery?: string
  ): Promise<GoogleDriveFile[]> {
    let query = `'${folderId}' in parents and trashed=false`;

    if (searchQuery) {
      query += ` and (name contains '${searchQuery.replace(/'/g, "\\'")}')`;
    }

    const params = new URLSearchParams({
      q: query,
      fields:
        "files(id,name,mimeType,size,iconLink,thumbnailLink,webViewLink,modifiedTime)",
      orderBy: "folder,name",
      pageSize: "100",
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.statusText}`);
    }
    ``;

    const data = await response.json();
    return data.files || [];
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      setIsSearching(true);
      try {
        const result = await searchGoogleDriveFiles(accessToken, searchQuery);
        setFiles(result);
      } catch (err) {
        console.error("Error searching files:", err);
        setError(err instanceof Error ? err.message : "Failed to search files");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, accessToken]);

  function handleBreadcrumbClick(index: number): void {
    const breadcrumb = breadcrumbs[index];
    setCurrentFolderId(breadcrumb.id);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setSearchQuery("");
    setIsSearching(false);
  }

  function handleFileToggle(file: GoogleDriveFile) {
    if (isFolder(file.mimeType)) {
      handleFolderClick(file);
      return;
    }
    const isSelected = selectedFiles.some((f) => f.id === file.id);
    if (isSelected) {
      onSelectFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      onSelectFiles([...selectedFiles, file]);
    }
  }

  function handleFolderClick(folder: GoogleDriveFile) {
    setCurrentFolderId(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    setSearchQuery("");
    setIsSearching(false);
  }

  function formatFileSize(bytes?: number): string {
    if (!bytes) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Google Drive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Breadcrumbs */}
      {!isSearching && (
        <div className="px-4 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-1 text-sm overflow-x-auto">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-1 shrink-0">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleBreadcrumbClick(index)}>
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {crumb.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-sm text-destructive bg-destructive/10 m-4 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Folder className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm">
              {isSearching ? "No files found" : "This folder is empty"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {files.map((file) => {
              const isSelected = selectedFiles.some((f) => f.id === file.id);
              const isFileFolder = isFolder(file.mimeType);

              return (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors",
                    isSelected && "bg-primary/10"
                  )}
                  onClick={() => handleFileToggle(file)}>
                  <div className="shrink-0">{getFileIcon(file.mimeType)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {!isFileFolder && formatFileSize(file.size)}
                    </div>
                  </div>
                  {isSelected && !isFileFolder && (
                    <Check className="h-5 w-5 text-primary shrink-0" />
                  )}
                  {isFileFolder && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Count */}
      {selectedFiles.length > 0 && (
        <div className="p-3 border-t bg-muted/30">
          <p className="text-sm font-medium">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
        </div>
      )}
    </div>
  );
}
