import type { LogoState } from "#/domain/logo/logo.types";
import { sanitizeLogoState } from "#/domain/logo/logo.validators";
import { useLogoStore } from "#/store/logo-store";

export function loadLogo(raw: unknown) {
  const logo = sanitizeLogoState(raw);
  useLogoStore.getState().set((d) => {
    Object.assign(d, logo);
  });
}

export function loadLogoFromState(logo: LogoState) {
  useLogoStore.getState().set((d) => {
    Object.assign(d, logo);
  });
}
