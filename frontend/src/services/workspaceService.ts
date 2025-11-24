import httpClient from "../lib/httpClient";
import type {
  AddWorkspaceMember,
  CreateWorkspace,
  UpdateWorkspace,
  UpdateWorkspaceMemberRole,
  Workspace,
} from "../types/workspace";

export const workspaceService = {
  getAll: async (): Promise<Workspace[]> => {
    const response = await httpClient.get<Workspace[]>("/workspaces");
    return response.data;
  },

  getById: async (id: string): Promise<Workspace> => {
    const response = await httpClient.get<Workspace>(`/workspaces/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkspace): Promise<Workspace> => {
    const response = await httpClient.post<Workspace>("/workspaces", data);
    return response.data;
  },

  update: async (id: string, data: UpdateWorkspace): Promise<Workspace> => {
    const response = await httpClient.put<Workspace>(`/workspaces/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/workspaces/${id}`);
  },

  addMember: async (
    workspaceId: string,
    data: AddWorkspaceMember
  ): Promise<AddWorkspaceMember> => {
    const response = await httpClient.post<AddWorkspaceMember>(
      `/workspaces/${workspaceId}/members`,
      data
    );
    return response.data;
  },

  removeMember: async (
    workspaceId: string,
    memberId: string
  ): Promise<void> => {
    await httpClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  },

  updateMemberRole: async (
    workspaceId: string,
    memberId: string,
    role: string
  ): Promise<UpdateWorkspaceMemberRole> => {
    const response = await httpClient.patch<UpdateWorkspaceMemberRole>(
      `/workspaces/${workspaceId}/members/${memberId}`,
      { role }
    );
    return response.data;
  },
};
