import axios from "axios";
import { CONFIG } from "./config";
import { setupMockInterceptor } from "./mockInterceptor";

const apiClient = axios.create({
  baseURL: CONFIG.BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error("Failed to parse auth storage:", error);
    }
  }
  return config;
});

// Setup mock interceptor if in demo mode
setupMockInterceptor(apiClient);

export default apiClient;
