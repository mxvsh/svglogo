import { useCollectionStore } from "#/store/collection-store";

export function useCollections() {
  return useCollectionStore((s) => s.collections);
}
