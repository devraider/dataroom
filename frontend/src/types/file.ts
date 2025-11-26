export interface DataRoomFile {
  id: number;
  name: string;
  mimeType?: string | null;
  size: number;
  createdAt: string;
  modifiedAt: string;
  googleDriveId?: string | null;
  thumbnailUrl?: string | null;
  webViewLink?: string | null;
  filePath?: string;
  workspaceId?: number;
  uploadedBy?: number;
}
