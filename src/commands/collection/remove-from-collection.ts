import { trackEvent } from "#/lib/analytics";
import { useCollectionStore } from "#/store/collection-store";
import { authClient } from "#/lib/auth-client";
import { removeCollectionFn } from "#/server/collection.remove";

export async function removeFromCollection(id: string) {
  useCollectionStore.getState().removeLogo(id);
  trackEvent("remove collection");

  const session = await authClient.getSession();
  if (session.data?.user) {
    void removeCollectionFn({ data: { id } });
  }
}
