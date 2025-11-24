import { workspaceService } from "@/services/workspaceService";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { LoadingSpinner } from "../common/LoadingSpinner";

export default function WorkspaceList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.getAll,
  });

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return <div>Workspace List Component</div>;
}
