import type { GoogleDriveFile } from "@/lib/googleDrive";

interface GoogleDriveFileBrowserProps {
  accessToken: string;
  onSelectFiles: (files: GoogleDriveFile[]) => void;
  selectedFiles: GoogleDriveFile[];
}

export function GoogleDriveFileBrowser({
  accessToken,
  onSelectFiles,
  selectedFiles,
}: GoogleDriveFileBrowserProps) {
  return <div>Google Drive File Browser Component</div>;
}
