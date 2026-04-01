export const ICON_SETS = [
  { id: "lucide", label: "Lucide", premium: false },
  { id: "tabler", label: "Tabler", premium: false },
  { id: "hugeicons", label: "Hugeicons", premium: false },
  { id: "heroicons", label: "Heroicons", premium: false },
  { id: "ph", label: "Phosphor", premium: false },
  { id: "ri", label: "Remix Icons", premium: false },
  { id: "ion", label: "Ionicons", premium: false },
  { id: "material-symbols", label: "Material Design", premium: false },
  { id: "streamline-ultimate-color", label: "Streamline", premium: true },
  { id: "fxemoji", label: "FX Emoji", premium: true },
  { id: "openmoji", label: "OpenMoji", premium: true },
  { id: "glyphs-poly", label: "Glyphs Poly", premium: true },
] as const;

export const FREE_ICON_SETS = ICON_SETS.filter((s) => !s.premium);

export const RANDOMIZE_ICON_SET_IDS = ["lucide", "tabler", "hugeicons", "heroicons", "ri"] as const;
export const PREMIUM_ICON_SETS = ICON_SETS.filter((s) => s.premium);

export const ICON_CATEGORIES = [
  { id: "food", label: "Food & Drink" },
  { id: "travel", label: "Travel" },
  { id: "nature", label: "Nature" },
  { id: "tech", label: "Technology" },
  { id: "health", label: "Health & Fitness" },
  { id: "business", label: "Business" },
  { id: "home", label: "Home" },
  { id: "art", label: "Art & Media" },
  { id: "weather", label: "Weather" },
  { id: "sport", label: "Sports" },
] as const;

export type IconCategoryId = typeof ICON_CATEGORIES[number]["id"];

export type IconSvgCache = {
  iconSvgContent: string;
  borderSvgContent: string;
  iconSvgUri: string;
  borderSvgUri: string;
};
