import { create } from "zustand";

interface UpgradeModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useUpgradeModalStore = create<UpgradeModalState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
