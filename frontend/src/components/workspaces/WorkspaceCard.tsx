import type { Workspace } from "@/types/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
  onOpen: (workspaceId: string) => void;
  onDelete: (workspaceId: string) => void;
}

export default function WorkspaceCard({
  workspace,
  onOpen,
  onDelete,
}: WorkspaceCardProps) {
  return;
}
