import axios from "axios";
import { CONFIG } from "./config";

const apiClient = axios.create({
  baseURL: CONFIG.BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
