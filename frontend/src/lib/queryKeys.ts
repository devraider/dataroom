export const QUERY_KEYS = {
  files: {
    all: ["files"],
    detail: (id: number) => ["files", id],
  },
  workspaces: {
    all: ["workspaces"],
    detail: (id: number) => ["workspaces", id],
  },
};
