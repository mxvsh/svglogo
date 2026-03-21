import { createContext, useRef, type ReactNode } from "react";
import {
  type AuthStore,
  type AuthUser,
  createAuthStore,
  setAuthStoreRef,
} from "#/store/auth-store";

export const AuthStoreContext = createContext<AuthStore | null>(null);

export function AuthStoreProvider({
  user,
  children,
}: {
  user: AuthUser | null;
  children: ReactNode;
}) {
  const storeRef = useRef<AuthStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAuthStore(user);
    setAuthStoreRef(storeRef.current);
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
}
