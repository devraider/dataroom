import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspaceService";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { UpdateWorkspace, AddWorkspaceMember } from "@/types/workspace";
import { toast } from "sonner";
import type { UserRole } from "@/types/auth";

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  const workspacesQuery = useQuery({
    queryKey: QUERY_KEYS.workspaces.all,
    queryFn: workspaceService.getAll,
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: workspaceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
      toast.success("Workspace created", {
        description: "Your new workspace has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Creation failed", {
        description:
          error.response?.data?.detail || "Failed to create workspace",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWorkspace }) =>
      workspaceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
      toast.success("Workspace updated", {
        description: "Your workspace has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Update failed", {
        description:
          error.response?.data?.detail || "Failed to update workspace",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: workspaceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
      toast.success("Workspace deleted", {
        description: "The workspace has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast.error("Delete failed", {
        description:
          error.response?.data?.detail || "Failed to delete workspace",
      });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: number;
      data: AddWorkspaceMember;
    }) => workspaceService.addMember(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
      toast.success("Member added", {
        description: "New member has been added to the workspace.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to add member", {
        description: error.response?.data?.detail || "Could not add member",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
    }: {
      workspaceId: number;
      memberId: number;
    }) => workspaceService.removeMember(workspaceId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
      toast.success("Member removed", {
        description: "Member has been removed from the workspace.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to remove member", {
        description: error.response?.data?.detail || "Could not remove member",
      });
    },
  });

  const updateMemberRoleMutation = useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
      role,
    }: {
      workspaceId: number;
      memberId: number;
      role: UserRole;
    }) => workspaceService.updateMemberRole(workspaceId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
      toast.success("Role updated", {
        description: "Member role has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update role", {
        description: error.response?.data?.detail || "Could not update role",
      });
    },
  });

  return {
    workspaces: workspacesQuery.data ?? [],
    isLoading: workspacesQuery.isLoading,
    isError: workspacesQuery.isError,
    error: workspacesQuery.error,
    refetch: workspacesQuery.refetch,

    createWorkspace: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateWorkspace: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteWorkspace: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    addMember: addMemberMutation.mutate,
    isAddingMember: addMemberMutation.isPending,
    addMemberError: addMemberMutation.error,

    removeMember: removeMemberMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,
    removeMemberError: removeMemberMutation.error,

    updateMemberRole: updateMemberRoleMutation.mutate,
    isUpdatingMemberRole: updateMemberRoleMutation.isPending,
    updateMemberRoleError: updateMemberRoleMutation.error,
  };
};

export const useWorkspace = (id: number) => {
  const workspaceQuery = useQuery({
    queryKey: QUERY_KEYS.workspaces.detail(id),
    queryFn: () => workspaceService.getById(id),
    enabled: !!id,
    staleTime: 30000,
  });

  return {
    workspace: workspaceQuery.data,
    isLoading: workspaceQuery.isLoading,
    isError: workspaceQuery.isError,
    error: workspaceQuery.error,
  };
};
