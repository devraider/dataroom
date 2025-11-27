import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ImportProgressStatus } from "@/types/enums";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { GoogleDriveFileBrowser } from "./GoogleDriveFileBrowser";
import type { GoogleDriveFile } from "@/types/googleDrive";
import { useWorkspaceStore } from "@/store/workspaceStore";

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
  const { currentWorkspace } = useWorkspaceStore();

  async function handleImport(): Promise<void> {
    console.log("handleImport called", {
      hasWorkspace: !!currentWorkspace,
      hasToken: !!accessToken,
      filesCount: selectedFiles.length,
    });
  }

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

          {importProgress.length > 0 && (
            <div className="p-6">
              <h4 className="text-sm font-medium mb-4">Import Progress</h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {importProgress.map((progress, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <span className="text-sm truncate flex-1">
                      {progress.fileName}
                    </span>
                    <div className="flex items-center gap-2 ml-4">
                      {progress.status === "pending" && (
                        <span className="text-xs text-muted-foreground">
                          Pending
                        </span>
                      )}
                      {progress.status === "uploading" && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      {progress.status === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      {progress.status === "error" && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-xs text-destructive">
                            {progress.error || "Failed"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isAuthenticated && !isImporting && importProgress.length === 0 && (
          <DialogFooter className="p-6 pt-0">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setSelectedFiles([]);
              }}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={selectedFiles.length === 0}>
              Import {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </DialogFooter>
        )}

        {!isImporting && importProgress.length > 0 && (
          <DialogFooter className="p-6 pt-0">
            <Button
              onClick={() => {
                setImportProgress([]);
                setSelectedFiles([]);
                setOpen(false);
              }}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
