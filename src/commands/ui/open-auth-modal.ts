import { useAuthStore } from "#/store/auth-store";

export function openAuthModal() {
  useAuthStore.getState().setAuthModalOpen(true);
}

export function closeAuthModal() {
  useAuthStore.getState().setAuthModalOpen(false);
}
