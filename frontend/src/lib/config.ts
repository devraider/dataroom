export const CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT
    ? parseInt(import.meta.env.VITE_API_TIMEOUT)
    : 30000,
  MODE: import.meta.env.VITE_MODE || "development",
} as const;

export const isDemoMode = () => CONFIG.MODE === "demo";
