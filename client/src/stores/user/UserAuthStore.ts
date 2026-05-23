import { create } from 'zustand';

interface AuthState {
    email: string | null;
    timeLeft: number;
    setData: (email: string, time: number, token?: string | null) => void;
    clearData: () => void;
    token?: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
    email: null,
    timeLeft: 0,
    token: null,
    setData: (email, time, token) => set({
        email,
        timeLeft: time,
        token: token
    }),
    clearData: () => set({ email: null, timeLeft: 0, token: null }),
}));
