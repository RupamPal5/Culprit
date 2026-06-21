import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  activePanel: 'explorer' | 'search' | 'git';
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setActivePanel: (panel: 'explorer' | 'search' | 'git') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'dark',
      activePanel: 'explorer',
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setActivePanel: (panel) => set({ activePanel: panel }),
    }),
    { name: 'ui-storage' }
  )
);
