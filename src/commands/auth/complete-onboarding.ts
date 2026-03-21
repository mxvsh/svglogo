import { getAuthStore } from "#/store/auth-store";
import { completeOnboardingFn } from "#/server/profile.complete-onboarding";

export async function completeOnboarding() {
  await completeOnboardingFn();
  const store = getAuthStore();
  const user = store.getState().user;
  if (user) {
    store.getState().setUser({ ...user, onboardingCompleted: true });
  }
}
