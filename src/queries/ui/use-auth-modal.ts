import { useAuthStore } from "#/store/auth-store";

export function useAuthModalOpen() {
  return useAuthStore((s) => s.authModalOpen);
}
