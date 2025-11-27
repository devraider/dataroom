import type { GoogleDriveFile } from "@/types/googleDrive";

// MIME type mappings for Google Docs export to Microsoft formats
export const GOOGLE_TO_MS_MIME_TYPES: Record<string, string> = {
  "application/vnd.google-apps.document":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Google Docs -> .docx
  "application/vnd.google-apps.spreadsheet":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Google Sheets -> .xlsx
  "application/vnd.google-apps.presentation":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // Google Slides -> .pptx
};

// File extensions for Microsoft formats
export const GOOGLE_TO_MS_EXTENSIONS: Record<string, string> = {
  "application/vnd.google-apps.document": ".docx",
  "application/vnd.google-apps.spreadsheet": ".xlsx",
  "application/vnd.google-apps.presentation": ".pptx",
};

export async function downloadGoogleDriveFile(
  file: GoogleDriveFile,
  accessToken: string
): Promise<Blob> {
  const isGoogleDoc = file.mimeType.startsWith("application/vnd.google-apps.");

  let url: string;
  if (isGoogleDoc) {
    // Export Google Docs as Microsoft Office format
    const exportMimeType =
      GOOGLE_TO_MS_MIME_TYPES[file.mimeType] || "application/pdf";
    url = `https://www.googleapis.com/drive/v3/files/${
      file.id
    }/export?mimeType=${encodeURIComponent(exportMimeType)}`;
  } else {
    // Download regular files
    url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  return await response.blob();
}

export function isGoogleDocsFile(mimeType: string): boolean {
  return mimeType.startsWith("application/vnd.google-apps.");
}

export function getExportedMimeType(mimeType: string): string {
  if (isGoogleDocsFile(mimeType)) {
    return GOOGLE_TO_MS_MIME_TYPES[mimeType] || "application/pdf";
  }
  return mimeType;
}

export function getExportedFilename(
  originalName: string,
  mimeType: string
): string {
  if (isGoogleDocsFile(mimeType)) {
    const extension = GOOGLE_TO_MS_EXTENSIONS[mimeType] || ".pdf";
    // Remove any existing Google Docs extension and add Microsoft extension
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    return `${nameWithoutExt}${extension}`;
  }
  return originalName;
}
