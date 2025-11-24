import type { User } from "./auth";

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  members: User[];
}
