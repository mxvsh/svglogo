import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CollectionItem } from "#/domain/collection/collection.types";
import type { LogoState } from "#/domain/logo/logo.types";

interface CollectionStoreState {
  collections: CollectionItem[];
  saveLogo: (logo: LogoState, id?: string) => string;
  removeLogo: (id: string) => void;
  clearCollections: () => void;
  loadCollections: (items: CollectionItem[]) => void;
  mergeCollections: (items: CollectionItem[]) => void;
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
      loadCollections: (items) => set({ collections: items }),
      mergeCollections: (items) =>
        set((state) => {
          const existingIds = new Set(state.collections.map((c) => c.id));
          const newItems = items.filter((c) => !existingIds.has(c.id));
          return {
            collections: [...state.collections, ...newItems]
              .sort((a, b) => b.savedAt - a.savedAt)
              .slice(0, 99),
          };
        }),
    }),
    {
      name: "svglogo-collections",
    },
  ),
);
