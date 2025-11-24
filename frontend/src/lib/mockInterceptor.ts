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

// Mock workspaces data
const mockWorkspaces = [
  {
    id: "1",
    name: "Marketing Team",
    description: "Marketing materials and campaign files",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: "1",
    members: [
      {
        id: "1",
        workspaceId: "1",
        userId: "1",
        email: "john.doe@example.com",
        name: "John Doe",
        role: "user",
        addedAt: new Date().toISOString(),
        picture:
          "https://ui-avatars.com/api/?name=Zando+Doe&background=4F46E5&color=fff",
      },
    ],
  },
  {
    id: "2",
    name: "Development",
    description: "Code documentation and technical resources",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: "1",
    members: [
      {
        id: "1",
        workspaceId: "2",
        userId: "1",
        email: "john.doe@example.com",
        name: "John Doe",
        role: "admin",
        addedAt: new Date().toISOString(),
      },
    ],
  },
];

const mockUser = {
  id: 1,
  email: "john.doe@example.com",
  name: "John Doe",
  role: "admin",
  picture:
    "https://ui-avatars.com/api/?name=Zando+Doe&background=4F46E5&color=fff",
};

export const setupMockInterceptor = (axiosInstance: AxiosInstance) => {
  if (!isDemoMode()) return;

  // Request interceptor for mock mode
  axiosInstance.interceptors.request.use(
    async (config) => {
      const url = config.url || "";

      // Mock Google auth
      if (url.includes("/auth/google")) {
        config.adapter = () => {
          return Promise.resolve({
            data: {
              user: mockUser,
              token: "mock-jwt-token-" + Date.now(),
            },
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        };
        return config;
      }

      // Mock workspaces list
      if (url === "/workspaces" && config.method === "get") {
        config.adapter = () => {
          return Promise.resolve({
            data: mockWorkspaces,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        };
        return config;
      }

      // Mock workspace creation
      if (url === "/workspaces" && config.method === "post") {
        const newWorkspace = {
          id: String(Date.now()),
          ...config.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ownerId: "1",
          members: [
            {
              id: "1",
              workspaceId: String(Date.now()),
              userId: "1",
              email: mockUser.email,
              name: mockUser.name,
              role: "owner",
              addedAt: new Date().toISOString(),
              picture: mockUser.picture,
            },
          ],
        };
        mockWorkspaces.push(newWorkspace);
        config.adapter = () => {
          return Promise.resolve({
            data: newWorkspace,
            status: 201,
            statusText: "Created",
            headers: {},
            config,
          });
        };
        return config;
      }

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
