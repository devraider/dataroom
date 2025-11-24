import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "@/services/fileService";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useFiles = (workspaceId: number) => {
  const queryClient = useQueryClient();

  const filesQuery = useQuery({
    queryKey: QUERY_KEYS.files.all,
    queryFn: () => fileService.getAll(workspaceId),
    staleTime: 30000,
    enabled: !!workspaceId,
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: number) => fileService.delete(workspaceId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.all });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (fileId: number) => fileService.download(workspaceId, fileId),
  });

  return {
    files: filesQuery.data ?? [],
    isLoading: filesQuery.isLoading,
    isError: filesQuery.isError,
    error: filesQuery.error,
    refetch: filesQuery.refetch,

    deleteFile: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    downloadFile: downloadMutation.mutate,
    isDownloading: downloadMutation.isPending,
  };
};

export const useFile = (workspaceId: number, id: number) => {
  const fileQuery = useQuery({
    queryKey: QUERY_KEYS.files.detail(id),
    queryFn: () => fileService.getById(workspaceId, id),
    enabled: !!id && !!workspaceId,
    staleTime: 30000,
  });

  return {
    file: fileQuery.data,
    isLoading: fileQuery.isLoading,
    isError: fileQuery.isError,
    error: fileQuery.error,
  };
};
