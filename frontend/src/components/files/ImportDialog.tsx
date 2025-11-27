import { useState } from "react";
import { Upload } from "lucide-react";
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
      </DialogContent>
    </Dialog>
  );
}
