import { trackEvent } from "#/lib/analytics";
import { useCollectionStore } from "#/store/collection-store";
import { useLogoStore } from "#/store/logo-store";
import { authClient } from "#/lib/auth-client";
import { saveCollectionFn } from "#/server/collection.save";

export async function saveToCollection() {
  const logo = useLogoStore.getState().present;
  const id = useCollectionStore.getState().saveLogo(logo);
  trackEvent("save collection", { icon: logo.iconName });

  const session = await authClient.getSession();
  if (session.data?.user) {
    void saveCollectionFn({ data: { id, logo } });
  }
}
