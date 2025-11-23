export interface DataRoomFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  googleDriveId?: string;
  thumbnailUrl?: string;
  webViewLink?: string;
}
