import type { GoogleDriveFile } from "@/lib/googleDrive";
import { Button } from "../ui/button";
import {
  Archive,
  ChevronRight,
  FileText,
  Home,
  Music,
  Presentation,
  Sheet,
  Video,
  File,
  Image,
  Folder,
  Search,
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

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

  function handleBreadcrumbClick(index: number): void {
    throw new Error("Function not implemented.");
  }

  function isFolder(mimeType: string): boolean {
    return mimeType === "application/vnd.google-apps.folder";
  }

  function handleFileToggle(file: GoogleDriveFile) {
    if (isFolder(file.mimeType)) {
      handleFolderClick(file);
      return;
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

  function getFileIcon(mimeType: string) {
    if (isFolder(mimeType)) return <Folder className="h-5 w-5 text-blue-500" />;
    if (mimeType.includes("document"))
      return <FileText className="h-5 w-5 text-blue-600" />;
    if (mimeType.includes("spreadsheet"))
      return <Sheet className="h-5 w-5 text-green-600" />;
    if (mimeType.includes("presentation"))
      return <Presentation className="h-5 w-5 text-orange-600" />;
    if (mimeType.startsWith("image"))
      return <Image className="h-5 w-5 text-purple-600" />;
    if (mimeType.startsWith("video"))
      return <Video className="h-5 w-5 text-red-600" />;
    if (mimeType.startsWith("audio"))
      return <Music className="h-5 w-5 text-pink-600" />;
    if (mimeType.includes("zip") || mimeType.includes("compressed"))
      return <Archive className="h-5 w-5 text-yellow-600" />;
    return <File className="h-5 w-5 text-gray-600" />;
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
    </div>
  );
}
