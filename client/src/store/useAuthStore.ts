import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthState {
  token?: string;
  user?: CustomerUser;
  hasHydrated: boolean;
  setSession: (token: string, user: CustomerUser) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: undefined, user: undefined }),
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "ty-customer-session",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
