import { useWorkspaceStore } from "@/store/workspaceStore";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { EmptyState } from "../common/EmptyState";
import WorkspaceCard from "./WorkspaceCard";
import { useState } from "react";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export default function WorkspaceList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  const { workspaces, isLoading, deleteWorkspace } = useWorkspaces();

  const handleOpenWorkspace = (workspaceId: number) => {
    const workspace = workspaces?.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      navigate(`/workspaces/${workspaceId}/files`);
    }
  };

  const handleDeleteWorkspace = (workspaceId: number) => {
    if (confirm("Are you sure you want to delete this workspace?")) {
      deleteWorkspace(workspaceId);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Workspaces</h1>
            <p className="text-muted-foreground mt-2">
              Manage your workspaces and collaborate with your team
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        </div>

        {!workspaces || workspaces.length === 0 ? (
          <EmptyState
            title="No workspaces yet"
            description="Create your first workspace to get started with organizing and sharing files."
            action={
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onOpen={handleOpenWorkspace}
                onDelete={handleDeleteWorkspace}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
