import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "@/services/fileService";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useFiles = () => {
  const queryClient = useQueryClient();

  const filesQuery = useQuery({
    queryKey: QUERY_KEYS.files.all,
    queryFn: fileService.getAll,
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: fileService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.all });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: fileService.download,
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

export const useFile = (id: number) => {
  const fileQuery = useQuery({
    queryKey: QUERY_KEYS.files.detail(id),
    queryFn: () => fileService.getById(id),
    enabled: !!id,
    staleTime: 30000,
  });

  return {
    file: fileQuery.data,
    isLoading: fileQuery.isLoading,
    isError: fileQuery.isError,
    error: fileQuery.error,
  };
};
