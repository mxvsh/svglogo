import { trackEvent } from "#/lib/analytics";
import { useCollectionStore } from "#/store/collection-store";
import { useLogoStore } from "#/store/logo-store";
import { saveCollectionFn } from "#/server/collection.save";

export async function saveToCollection() {
  const logo = useLogoStore.getState().present;
  const id = useCollectionStore.getState().saveLogo(logo);
  trackEvent("save collection", { icon: logo.iconName });
  void saveCollectionFn({ data: { id, logo } });
}
