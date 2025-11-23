import type { AxiosInstance } from "axios";
import { isDemoMode } from "./config";

// Mock data mapping
const mockDataMap: Record<string, string> = {
  "/files": "/mock/data/files.json",
  "/files/1": "/mock/data/files.json",
  "/files/2": "/mock/data/files.json",
  "/files/3": "/mock/data/files.json",
  "/files/4": "/mock/data/files.json",
};

export const setupMockInterceptor = (axiosInstance: AxiosInstance) => {
  if (!isDemoMode()) return;

  // Request interceptor for mock mode
  axiosInstance.interceptors.request.use(
    async (config) => {
      const url = config.url || "";

      // Check if we have mock data for this endpoint
      const mockPath = Object.keys(mockDataMap).find((key) =>
        url.includes(key)
      );

      if (mockPath) {
        const mockFile = mockDataMap[mockPath];

        // Fetch the mock data
        try {
          const response = await fetch(mockFile);
          const data = await response.json();

          // If it's a detail endpoint (e.g., /files/1), filter the data
          const idMatch = url.match(/\/files\/(\d+)$/);
          if (idMatch && Array.isArray(data)) {
            const id = parseInt(idMatch[1]);
            const item = data.find((item: any) => item.id === id);

            // Create a mock response
            config.adapter = () => {
              return Promise.resolve({
                data: item || null,
                status: item ? 200 : 404,
                statusText: item ? "OK" : "Not Found",
                headers: {},
                config,
              });
            };
          } else {
            // Return the full array
            config.adapter = () => {
              return Promise.resolve({
                data,
                status: 200,
                statusText: "OK",
                headers: {},
                config,
              });
            };
          }
        } catch (error) {
          console.error("Failed to load mock data:", error);
        }
      }

      // Handle DELETE requests
      if (config.method === "delete") {
        config.adapter = () => {
          return Promise.resolve({
            data: null,
            status: 204,
            statusText: "No Content",
            headers: {},
            config,
          });
        };
      }

      // Handle download requests
      if (url.includes("/download")) {
        config.adapter = () => {
          return Promise.resolve({
            data: new Blob(["Mock file content"], { type: "application/pdf" }),
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        };
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};
