import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CollectionItem } from "#/domain/collection/collection.types";
import type { LogoState } from "#/domain/logo/logo.types";

interface CollectionStoreState {
  collections: CollectionItem[];
  saveLogo: (logo: LogoState, id?: string) => string;
  removeLogo: (id: string) => void;
  clearCollections: () => void;
}

export const useCollectionStore = create<CollectionStoreState>()(
  persist(
    (set) => ({
      collections: [],
      saveLogo: (logo, id) => {
        const resolvedId = id ?? crypto.randomUUID();
        set((state) => ({
          collections: [
            { ...logo, id: resolvedId, savedAt: Date.now() },
            ...state.collections.slice(0, 19),
          ],
        }));
        return resolvedId;
      },
      removeLogo: (id) =>
        set((state) => ({
          collections: state.collections.filter((l) => l.id !== id),
        })),
      clearCollections: () => set({ collections: [] }),
    }),
    {
      name: "svglogo-collections",
    },
  ),
);
