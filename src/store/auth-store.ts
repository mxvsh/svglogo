import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
  // legacy fields used by old profile commands
  fullName?: string | null;
  onboardingCompleted?: boolean;
  creatorOnboarded?: boolean;
  earlyAccess?: string;
  plan?: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    setUser: (user) =>
      set((d) => {
        d.user = user;
      }),
  }))
);

// Called by set-user command
export const getAuthStore = () => useAuthStore;
