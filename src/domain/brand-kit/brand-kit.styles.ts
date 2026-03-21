import type { Background } from "#/domain/logo/logo.types";
import type { BrandKitStyle } from "./brand-kit.types";
import { getContrastTextColor } from "./brand-kit.colors";

export function resolveBackground(style: BrandKitStyle, background: Background): Background {
  if (style === "dark") return { type: "solid", color: "#111111" };
  if (style === "gradient") return background;
  return background.type === "solid"
    ? background
    : { type: "solid", color: background.stops[0]?.color ?? "#4F46E5" };
}

export function resolveTextColor(style: BrandKitStyle, bg: Background): string {
  if (style === "dark") return "#FFFFFF";
  const hex = bg.type === "solid" ? bg.color : (bg.stops[0]?.color ?? "#4F46E5");
  return getContrastTextColor(hex);
}
