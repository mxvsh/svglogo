import { trackEvent } from "#/lib/analytics";
import { useCollectionStore } from "#/store/collection-store";

export function removeFromCollection(id: string) {
  useCollectionStore.getState().removeLogo(id);
  trackEvent("remove collection");
}
