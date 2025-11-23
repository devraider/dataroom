import httpClient from "../lib/httpClient";
import type { User } from "../types/auth";

export interface GoogleAuthResponse {
  user: User;
  token: string;
}

export const authService = {
  googleLogin: async (credential: string): Promise<GoogleAuthResponse> => {
    const response = await httpClient.post<GoogleAuthResponse>("/auth/google", {
      credential,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get<User>("/auth/me");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await httpClient.post("/auth/logout");
  },
};
