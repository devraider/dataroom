import type { User, UserRole } from "./auth";

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  members: User[];
}

export interface CreateWorkspace {
  name: string;
  description?: string;
  owner: number;
}
export interface UpdateWorkspace {
  name?: string;
  description?: string;
}
export interface AddWorkspaceMember {
  email: string;
  role: UserRole;
}

export interface UpdateWorkspaceMemberRole {
  workspaceId: number;
  userId: number;
  role: UserRole;
}
