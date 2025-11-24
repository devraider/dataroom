import type { DataRoomFile } from "@/types/file";
import apiClient from "@/lib/httpClient";

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
};
