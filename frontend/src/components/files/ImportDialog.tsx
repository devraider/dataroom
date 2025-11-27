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
import { ImportProgressStatus } from "@/types/enums";
import type { ImportProgressStatus as ImportProgressStatusType } from "@/types/enums";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { GoogleDriveFileBrowser } from "./GoogleDriveFileBrowser";
import type { GoogleDriveFile } from "@/types/googleDrive";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queryClient } from "@/lib/queryClient";
import { fileService } from "@/services/fileService";
import {
  getExportedFilename,
  getExportedMimeType,
  isGoogleDocsFile,
} from "@/lib/googleDrive";

interface ImportProgress {
  fileName: string;
  status: ImportProgressStatusType;
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

  function initializeImportProgress() {
    setImportProgress(
      selectedFiles.map((file) => ({
        fileName: file.name,
        status: ImportProgressStatus.PENDING,
      }))
    );
  }

  function updateFileProgress(
    index: number,
    status: ImportProgressStatusType,
    error?: string
  ) {
    setImportProgress((prev) =>
      prev.map((p, idx) =>
        idx === index ? { ...p, status, ...(error && { error }) } : p
      )
    );
  }

  async function importSingleFile(
    file: GoogleDriveFile,
    index: number
  ): Promise<boolean> {
    const exportedName = getExportedFilename(file.name, file.mimeType);
    const exportedMimeType = getExportedMimeType(file.mimeType);

    updateFileProgress(index, ImportProgressStatus.UPLOADING);

    try {
      await fileService.importFromGoogleDrive(
        currentWorkspace!.id,
        file.id,
        accessToken!,
        {
          name: exportedName,
          mimeType: exportedMimeType,
          originalMimeType: file.mimeType,
          isGoogleDoc: isGoogleDocsFile(file.mimeType),
        }
      );

      updateFileProgress(index, ImportProgressStatus.SUCCESS);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Import failed";
      updateFileProgress(index, ImportProgressStatus.ERROR, errorMessage);
      return false;
    }
  }

  function handleImportComplete(successCount: number, errorCount: number) {
    if (errorCount === 0) {
      toast.success(`Successfully imported ${successCount} file(s)`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.all });
      setTimeout(() => {
        resetImportState();
      }, 2000);
    } else {
      toast.warning(`Imported ${successCount} file(s), ${errorCount} failed`);
      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.all });
      }
    }
  }

  function resetImportState() {
    setOpen(false);
    setSelectedFiles([]);
    setImportProgress([]);
  }

  async function handleImport(): Promise<void> {
    if (!currentWorkspace || !accessToken || selectedFiles.length === 0) {
      console.warn("Import blocked: Missing workspace, token, or files");
      toast.error("Cannot import files at this time.");
      return;
    }

    setIsImporting(true);
    initializeImportProgress();

    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const success = await importSingleFile(selectedFiles[i], i);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      handleImportComplete(successCount, errorCount);
    } catch (err) {
      toast.error("Failed to import files");
    } finally {
      setIsImporting(false);
    }
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
