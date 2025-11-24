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

export interface ActionAddWorkspaceMember {
  email: string;
  role: UserRole;
}

export interface ActionUpdateWorkspace {
  name?: string;
  description?: string;
}
