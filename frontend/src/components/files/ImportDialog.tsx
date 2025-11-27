import { useState } from "react";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ImportProgressStatus } from "@/types/enums";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { GoogleDriveFileBrowser } from "./GoogleDriveFileBrowser";
import type { GoogleDriveFile } from "@/types/googleDrive";

interface ImportProgress {
  fileName: string;
  status: ImportProgressStatus;
  error?: string;
}

export function ImportDialog() {
  const [open, setOpen] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress[]>([]);
  const { isAuthenticated, accessToken, error, authenticate, isLoading } =
    useGoogleDrive();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<GoogleDriveFile[]>([]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import from Google Drive
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Import from Google Drive</DialogTitle>
          <DialogDescription>
            Select files from your Google Drive to import. Google Docs files
            will be exported as Microsoft Office formats.
          </DialogDescription>
        </DialogHeader>

        {/* Connection to Google Drive. */}
        <div className="flex-1 overflow-hidden">
          {error && (
            <div className="flex items-center gap-2 p-3 mx-6 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {!isImporting && importProgress.length === 0 && (
            <>
              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">
                      Connect to Google Drive
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Authenticate with your Google account to browse and import
                      files
                    </p>
                  </div>
                  <Button onClick={authenticate} disabled={isLoading} size="lg">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Connect to Google Drive
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <GoogleDriveFileBrowser
                  accessToken={accessToken!}
                  selectedFiles={selectedFiles}
                  onSelectFiles={setSelectedFiles}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
