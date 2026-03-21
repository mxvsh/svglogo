import type { BrandKitStyle, BrandKitLayout } from "#/domain/brand-kit/brand-kit.types";

export interface StylePreset {
  id: BrandKitStyle;
  label: string;
}

export interface LayoutPreset {
  id: BrandKitLayout;
  label: string;
  icon: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  { id: "minimal", label: "Minimal" },
  { id: "gradient", label: "Gradient" },
  { id: "dark", label: "Dark" },
];

export const LAYOUT_PRESETS: LayoutPreset[] = [
  { id: "centered", label: "Centered", icon: "gravity-ui:layout-cells-large" },
  { id: "landscape", label: "Landscape", icon: "gravity-ui:layout-columns" },
];

export const PREVIEW_ASSET_IDS = ["og", "twitter-banner", "instagram-post", "facebook-cover"] as const;

export const PREVIEW_TAB_LABELS: Record<string, string> = {
  og: "OG",
  "twitter-banner": "X",
  "instagram-post": "Instagram",
  "facebook-cover": "Facebook",
};
