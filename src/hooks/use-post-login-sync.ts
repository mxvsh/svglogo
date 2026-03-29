import { useEffect, useState } from "react";
import { useSession } from "#/queries/auth/use-session";
import { useCollectionStore } from "#/store/collection-store";
import { getCollectionsFn } from "#/server/collection.get";
import type { CollectionItem } from "#/domain/collection/collection.types";

const SESSION_KEY = "svglogo-synced-user";

export function usePostLoginSync() {
  const { data: session } = useSession();
  const [syncData, setSyncData] = useState<{ cloud: CollectionItem[]; local: CollectionItem[] } | null>(null);

  useEffect(() => {
    const userId = session?.user.id ?? null;
    const onboardingCompleted = session?.user.onboardingCompleted ?? false;
    if (!userId || !onboardingCompleted) return;

    // Already ran sync check for this user in this browser session
    if (sessionStorage.getItem(SESSION_KEY) === userId) return;
    sessionStorage.setItem(SESSION_KEY, userId);

    async function sync() {
      const cloud = await getCollectionsFn() as CollectionItem[];
      if (cloud.length === 0) return;

      const local = useCollectionStore.getState().collections;
      const localIds = new Set(local.map((c) => c.id));
      const cloudOnlyItems = cloud.filter((c) => !localIds.has(c.id));

      // Nothing new in cloud — already in sync
      if (cloudOnlyItems.length === 0) return;

      if (local.length === 0) {
        useCollectionStore.getState().loadCollections(cloud);
        return;
      }

      setSyncData({ cloud, local });
    }

    void sync();
  }, [session?.user.id, session?.user.onboardingCompleted]);

  return { syncData, clearSyncData: () => setSyncData(null) };
}
