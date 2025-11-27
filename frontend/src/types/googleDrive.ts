export interface ImportGoogleDriveOptions {
  name: string;
  mimeType: string;
  originalMimeType: string;
  isGoogleDoc: boolean;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  thumbnailLink?: string;
  webViewLink?: string;
  modifiedTime?: string;
  iconLink?: string;
}
