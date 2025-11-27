import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth";
import { StorageKey } from "../types/enums";
import { authService } from "../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
          // Continue with local logout even if backend call fails
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: StorageKey.AUTH,
    }
  )
);
