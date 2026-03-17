import { trackEvent } from "#/lib/analytics";
import { useCollectionStore } from "#/store/collection-store";
import { useLogoStore } from "#/store/logo-store";

export function saveToCollection() {
  const logo = useLogoStore.getState().present;
  useCollectionStore.getState().saveLogo(logo);
  trackEvent("save collection", { icon: logo.iconName });
}
