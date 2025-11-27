export const QUERY_KEYS = {
  files: {
    all: (workspaceId: number) => ["files", workspaceId],
    detail: (workspaceId: number, id: number) => ["files", workspaceId, id],
  },
  workspaces: {
    all: ["workspaces"],
    detail: (id: number) => ["workspaces", id],
  },
};
