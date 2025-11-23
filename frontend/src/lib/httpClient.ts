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

// Setup mock interceptor if in demo mode
setupMockInterceptor(apiClient);

export default apiClient;
