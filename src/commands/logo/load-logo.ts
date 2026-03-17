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
    d.iconName = logo.iconName;
    d.iconColor = logo.iconColor;
    d.iconBorderColor = logo.iconBorderColor;
    d.iconBorderWidth = logo.iconBorderWidth;
    d.iconSize = logo.iconSize;
    d.iconRotation = logo.iconRotation;
    d.background = logo.background;
    d.borderRadius = logo.borderRadius;
    d.borderWidth = logo.borderWidth;
    d.borderColor = logo.borderColor;
  });
}
