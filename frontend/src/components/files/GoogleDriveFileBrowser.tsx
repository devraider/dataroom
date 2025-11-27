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
} from "lucide-react";
import { useState } from "react";

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

  function handleBreadcrumbClick(index: number): void {
    throw new Error("Function not implemented.");
  }

  function isFolder(mimeType: string): boolean {
    return mimeType === "application/vnd.google-apps.folder";
  }

  return (
    <div className="flex flex-col h-[500px]">
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
    </div>
  );
}
