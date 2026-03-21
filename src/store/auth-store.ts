import { createStore } from "zustand/vanilla";

export interface AuthUser {
  email: string;
}

export interface AuthStoreState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export type AuthStore = ReturnType<typeof createAuthStore>;

export function createAuthStore(initialUser: AuthUser | null = null) {
  return createStore<AuthStoreState>()((set) => ({
    user: initialUser,
    setUser: (user) => set({ user }),
  }));
}

/** Module-level ref so commands can access the store outside React */
let _storeRef: AuthStore | null = null;

export function setAuthStoreRef(store: AuthStore) {
  _storeRef = store;
}

export function getAuthStore() {
  if (!_storeRef) throw new Error("AuthStore not initialized");
  return _storeRef;
}
