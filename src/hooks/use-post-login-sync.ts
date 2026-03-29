import { useEffect, useRef, useState } from "react";
import { useSession } from "#/queries/auth/use-session";
import { useCollectionStore } from "#/store/collection-store";
import { getCollectionsFn } from "#/server/collection.get";
import type { CollectionItem } from "#/domain/collection/collection.types";

// Fires once when a user first becomes authenticated AND has completed onboarding
// Returns sync state so AppShell can show the merge/replace modal
export function usePostLoginSync() {
  const { data: session } = useSession();
  const prevUserId = useRef<string | null>(null);
  const [syncData, setSyncData] = useState<{ cloud: CollectionItem[]; local: CollectionItem[] } | null>(null);

  useEffect(() => {
    const userId = session?.user.id ?? null;
    const onboardingCompleted = session?.user.onboardingCompleted ?? false;
    if (!userId || !onboardingCompleted || userId === prevUserId.current) return;
    prevUserId.current = userId;

    async function sync() {
      const cloud = await getCollectionsFn() as CollectionItem[];
      if (cloud.length === 0) return;

      const local = useCollectionStore.getState().collections;
      if (local.length === 0) {
        useCollectionStore.getState().loadCollections(cloud);
        return;
      }

      setSyncData({ cloud, local });
    }

    void sync();
  }, [session?.user.id]);

  return { syncData, clearSyncData: () => setSyncData(null) };
}
