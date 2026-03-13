import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LogoState } from "./logoStore";

export interface CollectionItem extends LogoState {
  id: string;
  savedAt: number;
}

interface CollectionState {
  collections: CollectionItem[];
  saveLogo: (logo: LogoState) => void;
  removeLogo: (id: string) => void;
  clearCollections: () => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collections: [],
      saveLogo: (logo) =>
        set((state) => ({
          collections: [
            {
              ...logo,
              id: crypto.randomUUID(),
              savedAt: Date.now(),
            },
            ...state.collections.slice(0, 6),
          ],
        })),
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
