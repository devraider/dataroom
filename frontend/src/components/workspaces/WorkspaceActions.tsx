import { MoreVertical, Trash2, Edit, FolderOpen, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface WorkspaceActionsProps {
  workspaceId: number;
  onOpen: (workspaceId: number) => void;
  onEdit: () => void;
  onManageMembers: () => void;
  onDelete: (workspaceId: number) => void;
}

export default function WorkspaceActions({
  workspaceId,
  onOpen,
  onEdit,
  onManageMembers,
  onDelete,
}: WorkspaceActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpen(workspaceId)}>
          <FolderOpen className="mr-2 h-4 w-4" />
          Open Workspace
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onManageMembers}>
          <Users className="mr-2 h-4 w-4" />
          Manage Members
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(workspaceId)}
          className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
