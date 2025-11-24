import {
  Folder,
  Users,
  MoreVertical,
  Trash2,
  Edit,
  FolderOpen,
} from "lucide-react";
import type { Workspace } from "../../types/workspace";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";

interface WorkspaceCardProps {
  workspace: Workspace;
  onOpen: (workspaceId: number) => void;
  onDelete: (workspaceId: number) => void;
}

export default function WorkspaceCard({
  workspace,
  onOpen,
  onDelete,
}: WorkspaceCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div
              className="flex items-center space-x-3"
              onClick={() => onOpen(workspace.id)}>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{workspace.name}</CardTitle>
                <CardDescription className="mt-1">
                  {workspace.description || "No description"}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onOpen(workspace.id)}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Open Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsMembersDialogOpen(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Members
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(workspace.id)}
                  className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent onClick={() => onOpen(workspace.id)}>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{workspace.members.length} members</span>
            </div>
            <span>
              Updated {new Date(workspace.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
