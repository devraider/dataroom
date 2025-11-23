export const QUERY_KEYS = {
  files: {
    all: ["files"],
    detail: (id: number) => ["files", id],
  },
};
