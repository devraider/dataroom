import { UserRole, type User } from "@/types/auth";
import type { DataRoomFile } from "@/types/file";
import type { Workspace } from "@/types/workspace";

export const canImportFiles = (
  user: User | null,
  workspace: Workspace | null
): boolean => {
  if (!user || !workspace) return false;

  // Find user's role in the workspace
  const member = workspace.members.find((m) => m.id === user.id);
  if (!member) return false;

  // Admins and users can import files
  return member.role === UserRole.ADMIN || member.role === UserRole.USER;
};

export const canDeleteFile = (
  user: User | null,
  workspace: Workspace | null,
  file: DataRoomFile
): boolean => {
  if (!user || !workspace) return false;

  // Find user's role in the workspace
  const member = workspace.members.find((m) => m.id === user.id);
  if (!member) return false;

  // Admins can delete any file
  if (member.role === UserRole.ADMIN) return true;

  // Users can delete only their own files
  if (member.role === UserRole.USER) {
    return file.uploadedBy === user.id;
  }

  // Viewers cannot delete files
  return false;
};

export const canViewFile = (
  user: User | null,
  workspace: Workspace | null
): boolean => {
  if (!user || !workspace) return false;

  // All workspace members can view files
  return workspace.members.some((m) => m.id === user.id);
};

export const canDownloadFile = (
  user: User | null,
  workspace: Workspace | null
): boolean => {
  if (!user || !workspace) return false;

  // All workspace members can download files
  return workspace.members.some((m) => m.id === user.id);
};

export const getUserRole = (
  user: User | null,
  workspace: Workspace | null
): UserRole | null => {
  if (!user || !workspace) return null;

  const member = workspace.members.find((m) => m.id === user.id);
  return member?.role || null;
};
