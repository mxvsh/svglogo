import { getAuthStore } from "#/store/auth-store";
import { signUpEarlyAccessFn } from "#/server/profile.sign-up-early-access";

export async function signUpEarlyAccess() {
  await signUpEarlyAccessFn();
  const store = getAuthStore();
  const user = store.getState().user;
  if (user) {
    store.getState().setUser({ ...user, earlyAccess: true });
  }
}
