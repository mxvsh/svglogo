import type { LogoState } from "#/domain/logo/logo.types";
import { useLogoStore } from "#/store/logo-store";

export function updateLogo(updater: (draft: LogoState) => void) {
  useLogoStore.getState().set(updater);
}
