import { getAuthStore } from "#/store/auth-store";
import { updateProfileNameFn } from "#/server/profile.update-name";

export async function updateProfileName(fullName: string) {
  await updateProfileNameFn({ data: { fullName } });
  const store = getAuthStore();
  const user = store.getState().user;
  if (user) {
    store.getState().setUser({ ...user, fullName });
  }
}
