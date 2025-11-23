import type { DataRoomFile } from "@/types/file";
import apiClient from "@/lib/httpClient";

export const fileService = {
  getAll: async (): Promise<DataRoomFile[]> => {
    const { data } = await apiClient.get<DataRoomFile[]>("/files");
    return data;
  },

  getById: async (id: number): Promise<DataRoomFile> => {
    const { data } = await apiClient.get<DataRoomFile>(`/files/${id}`);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/files/${id}`);
  },

  download: async (id: number): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(`/files/${id}/download`, {
      responseType: "blob",
    });
    return data;
  },
};
