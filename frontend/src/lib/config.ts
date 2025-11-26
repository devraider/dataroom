export const CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT
    ? parseInt(import.meta.env.VITE_API_TIMEOUT)
    : 30000,
  MODE: import.meta.env.VITE_MODE || "demo",
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
  GOOGLE_DRIVE_SCOPE: import.meta.env.VITE_GOOGLE_SCOPE,
  GOOGLE_APP_ID: import.meta.env.VITE_GOOGLE_APP_ID,
} as const;

export const isDemoMode = () => CONFIG.MODE === "demo";
