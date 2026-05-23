import type { AdminType } from '@shared/types/admin/AdminTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminStore {
  isAuthenticated: boolean;
  role: string;
  data: AdminType | null;
  setData: (data: AdminType, role?: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      data: null,
      isAuthenticated: false,
      role: "",

      setData: (data, role) => set({
        data,
        isAuthenticated: true,
        role: role ?? data.role ?? ""
      }),

      logout: () => set({
        data: null,
        isAuthenticated: false,
        role: ""
      }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        data: state.data,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);
