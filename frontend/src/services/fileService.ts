import type { DataRoomFile } from "@/types/file";
import apiClient from "@/lib/httpClient";
import {
  downloadGoogleDriveFile,
  type GoogleDriveFile,
} from "@/lib/googleDrive";
import type { ImportGoogleDriveOptions } from "@/types/googleDrive";

export const fileService = {
  getAll: async (workspaceId: number): Promise<DataRoomFile[]> => {
    const { data } = await apiClient.get<DataRoomFile[]>(
      `/workspaces/${workspaceId}/files`
    );
    return data;
  },

  getById: async (workspaceId: number, id: number): Promise<DataRoomFile> => {
    const { data } = await apiClient.get<DataRoomFile>(
      `/workspaces/${workspaceId}/files/${id}`
    );
    return data;
  },

  delete: async (workspaceId: number, id: number): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/files/${id}`);
  },

  download: async (workspaceId: number, id: number): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(
      `/workspaces/${workspaceId}/files/${id}/download`,
      {
        responseType: "blob",
      }
    );
    return data;
  },

  importFromGoogleDrive: async (
    workspaceId: number,
    googleDriveFileId: string,
    accessToken: string,
    options: ImportGoogleDriveOptions
  ): Promise<DataRoomFile> => {
    const blob = await downloadGoogleDriveFile(
      {
        id: googleDriveFileId,
        name: options.name,
        mimeType: options.originalMimeType,
      } as GoogleDriveFile,
      accessToken
    );

    // Create FormData to upload the file
    const formData = new FormData();
    formData.append("file", blob, options.name);
    formData.append("googleDriveId", googleDriveFileId);

    // Upload to backend
    const { data } = await apiClient.post<DataRoomFile>(
      `/workspaces/${workspaceId}/files/import/google-drive`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  fileDownload: async (workspaceId: number, id: number): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(
      `/workspaces/${workspaceId}/files/${id}/download`,
      {
        responseType: "blob",
      }
    );
    return data;
  },
};
