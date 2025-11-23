import type { DataRoomFile } from "@/types/file";
import apiClient from "@/lib/httpClient";

export const fileService = {
  getAll: async (): Promise<DataRoomFile[]> => {
    const { data } = await apiClient.get<DataRoomFile[]>("/files");
    return data;
  },

  getById: async (id: string): Promise<DataRoomFile> => {
    const { data } = await apiClient.get<DataRoomFile>(`/files/${id}`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/files/${id}`);
  },

  download: async (id: string): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(`/files/${id}/download`, {
      responseType: "blob",
    });
    return data;
  },
};
