import { useUpgradeModalStore } from "#/store/upgrade-modal-store";

export function openUpgradeModal() {
  useUpgradeModalStore.getState().open();
}
