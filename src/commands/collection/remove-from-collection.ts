import { trackEvent } from "#/lib/analytics";
import { useCollectionStore } from "#/store/collection-store";
import { removeCollectionFn } from "#/server/collection.remove";

export async function removeFromCollection(id: string) {
  useCollectionStore.getState().removeLogo(id);
  trackEvent("remove collection");
  void removeCollectionFn({ data: { id } });
}
