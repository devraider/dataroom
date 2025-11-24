export default function WorkspaceList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  return <div>Workspace List Component</div>;
}
