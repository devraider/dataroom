export const CONFIG = {
  BASE_URL: import.meta.env.API_URL || "http://localhost:5000/api",
  TIMEOUT: import.meta.env.API_TIMEOUT
    ? parseInt(import.meta.env.API_TIMEOUT)
    : 30000,
  MODE: import.meta.env.MODE || "development",
} as const;

export const isDemoMode = () => CONFIG.MODE === "demo";
