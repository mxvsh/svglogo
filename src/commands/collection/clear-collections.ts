import { useCollectionStore } from "#/store/collection-store";

export function clearCollections() {
  useCollectionStore.getState().clearCollections();
}
