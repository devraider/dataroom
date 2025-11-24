import type { Workspace } from "@/types/workspace";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { UserRole } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspaceService";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { toast } from "sonner";

interface ManageMembersDialogProps {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManageMembersDialog({
  workspace,
  open,
  onOpenChange,
}: ManageMembersDialogProps) {
  const queryClient = useQueryClient();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<UserRole>(UserRole.READER);

  const addMemberMutation = useMutation({
    mutationFn: (data: { email: string; role: UserRole }) =>
      workspaceService.addMember(workspace.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
      toast.success("Member added", {
        description: "New member has been added to the workspace.",
      });
      setNewMemberEmail("");
      setNewMemberRole(UserRole.READER);
    },
    onError: (error: any) => {
      toast.error("Failed to add member", {
        description: error.response?.data?.message || "Could not add member",
      });
    },
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) {
      toast.error("Email required", {
        description: "Please enter a valid email address",
      });
      return;
    }
    addMemberMutation.mutate({
      email: newMemberEmail,
      role: newMemberRole,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Invite a user to this workspace by entering their email address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={newMemberRole}
              onValueChange={(value) => setNewMemberRole(value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.READER}>Viewer</SelectItem>
                <SelectItem value={UserRole.USER}>Editor</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={addMemberMutation.isPending}>
            <UserPlus className="mr-2 h-4 w-4" />
            {addMemberMutation.isPending ? "Adding..." : "Add Member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
