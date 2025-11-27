import { useEffect, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  X,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fileService } from "@/services/fileService";
import { getFileType } from "@/lib/utils";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileViewerProps {
  workspaceId: number;
  fileId: number;
  fileName: string;
  mimeType?: string;
  onClose: () => void;
}

export function FileViewer({
  workspaceId,
  fileId,
  fileName,
  mimeType,
  onClose,
}: FileViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isPageRendering, setIsPageRendering] = useState(false);

  const { isPdf, isImage, isText, isOfficeDoc } = getFileType(mimeType);

  const fetchFile = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const blob = await fileService.download(workspaceId, fileId);
      const url = window.URL.createObjectURL(blob);
      setBlobUrl(url);
    } catch (err) {
      console.error("Failed to load file:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load file. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, fileId]);

  useEffect(() => {
    fetchFile();

    return () => {
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl);
      }
    };
  }, [fetchFile]);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  useEffect(() => {
    if (!isPdf || numPages <= 1) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && pageNumber > 1) {
        setPageNumber((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && pageNumber < numPages) {
        setPageNumber((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPdf, pageNumber, numPages]);

  const handleDownload = async () => {
    if (!blobUrl) return;

    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    fetchFile();
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsPageRendering(false);
  }

  function onPageLoadSuccess() {
    setIsPageRendering(false);
  }

  function onPageRenderStart() {
    setIsPageRendering(true);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="truncate text-sm sm:text-base pr-2">
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading || !blobUrl}
                className="text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {isDownloading ? "Downloading..." : "Download"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 sm:h-10 sm:w-10">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-3 sm:p-6 bg-gray-50 dark:bg-gray-900">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading file...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-4">
                <p className="text-destructive mb-4">{error}</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button onClick={handleRetry} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                  <Button onClick={onClose} variant="secondary">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && blobUrl && (
            <>
              {isPdf && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {isPageRendering && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    <Document
                      file={blobUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={
                        <div className="flex items-center justify-center min-h-[400px]">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      }
                      error={
                        <div className="text-center p-8">
                          <p className="text-destructive">Failed to load PDF</p>
                        </div>
                      }>
                      <Page
                        pageNumber={pageNumber}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="shadow-lg"
                        onLoadSuccess={onPageLoadSuccess}
                        onRenderSuccess={onPageRenderStart}
                        width={Math.min(window.innerWidth - 100, 800)}
                      />
                    </Document>
                  </div>

                  {numPages > 1 && (
                    <div className="flex items-center gap-2 sm:gap-4 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-lg shadow sticky bottom-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPageNumber((prev) => Math.max(1, prev - 1))
                        }
                        disabled={pageNumber <= 1}
                        className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Previous</span>
                      </Button>
                      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                        {pageNumber} / {numPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPageNumber((prev) => Math.min(numPages, prev + 1))
                        }
                        disabled={pageNumber >= numPages}
                        className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3">
                        <span className="hidden sm:inline mr-1">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {numPages > 1 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Use arrow keys ← → to navigate
                    </p>
                  )}
                </div>
              )}

              {isImage && (
                <div className="flex items-center justify-center min-h-[400px]">
                  <img
                    src={blobUrl}
                    alt={fileName}
                    className="max-w-full max-h-[calc(90vh-200px)] object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}

              {isText && (
                <iframe
                  src={blobUrl}
                  className="w-full h-full border-0 bg-white dark:bg-gray-800 rounded-lg"
                  title={fileName}
                />
              )}

              {!isPdf && !isImage && !isText && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md px-4">
                    <p className="text-muted-foreground mb-4">
                      Preview not available for this file type.
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      File type: {mimeType || "Unknown"}
                    </p>
                    {isOfficeDoc && (
                      <p className="text-xs text-muted-foreground mb-4 bg-blue-50 dark:bg-blue-950 p-3 rounded">
                        Office documents (Word, Excel, PowerPoint) can be
                        downloaded to view.
                      </p>
                    )}
                    <Button onClick={handleDownload} disabled={isDownloading}>
                      <Download className="h-4 w-4 mr-2" />
                      {isDownloading ? "Downloading..." : "Download to View"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
