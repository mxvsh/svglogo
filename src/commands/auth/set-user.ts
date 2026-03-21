import type { AuthUser } from "#/store/auth-store";
import { getAuthStore } from "#/store/auth-store";

export function setUser(user: AuthUser | null) {
  getAuthStore().getState().setUser(user);
}
