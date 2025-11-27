import { MoreVertical, Download, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileActionsProps {
  fileId: number;
  fileName: string;
  webViewLink?: string;
  onView?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

export function FileActions({
  webViewLink,
  onView,
  onDelete,
  onDownload,
}: FileActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        {webViewLink && (
          <DropdownMenuItem onClick={() => window.open(webViewLink, "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Google Drive
          </DropdownMenuItem>
        )}
        {onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
