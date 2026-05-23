import type { UserType } from '@shared/types/user/UserType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserStore {
  isAuthenticated: boolean;
  isBlocked: boolean;
  role: string;
  user: UserType | null;
  setUser: (user: UserType) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isBlocked: false,
      role: "",

      setUser: (user) =>
        set({
          user,
          isBlocked: user.isBlocked,
          isAuthenticated: true,
          role: "user",
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          role: "",
        }),
    }),
    {
      name: "user-storage",

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);
