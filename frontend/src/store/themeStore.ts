import { StorageKey, Theme } from "@/types/enums";
import { create } from "zustand";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement;
  root.classList.remove(Theme.DARK, Theme.LIGHT);

  if (theme === Theme.SYSTEM) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? Theme.DARK
      : Theme.LIGHT;
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: Theme.SYSTEM,
  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
    localStorage.setItem(
      StorageKey.THEME,
      JSON.stringify({ state: { theme } })
    );
  },
}));

if (typeof window !== "undefined") {
  const stored = localStorage.getItem(StorageKey.THEME);
  const theme = stored
    ? JSON.parse(stored).state?.theme || Theme.SYSTEM
    : Theme.SYSTEM;
  useThemeStore.getState().setTheme(theme);
}
