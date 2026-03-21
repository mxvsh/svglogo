import { useContext } from "react";
import { useStore } from "zustand";
import { AuthStoreContext } from "#/providers/AuthStoreProvider";

export function useAuth() {
  const store = useContext(AuthStoreContext);
  if (!store) throw new Error("useAuth must be used within AuthStoreProvider");
  return useStore(store, (s) => s.user);
}
