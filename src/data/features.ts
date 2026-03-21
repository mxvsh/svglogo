export interface Feature {
  label: string;
  anonymous: boolean;
  free: boolean;
  creator: boolean;
}

export const FEATURES: Feature[] = [
  { label: "SVG, PNG, ICO export", anonymous: true, free: true, creator: true },
  { label: "300,000+ icons", anonymous: true, free: true, creator: true },
  { label: "Multi-stop gradients", anonymous: true, free: true, creator: true },
  { label: "Share with a link", anonymous: true, free: true, creator: true },
  { label: "Sync Collections", anonymous: false, free: true, creator: true },
  { label: "Unlimited advanced export", anonymous: false, free: true, creator: true },
  { label: "Brand kit download", anonymous: false, free: false, creator: true },
  { label: "Premium fonts & icon sets", anonymous: false, free: false, creator: true },
  { label: "Abstract logo generator", anonymous: false, free: false, creator: true },
  { label: "Transparent background", anonymous: false, free: false, creator: true },
  { label: "Infinite logo variations", anonymous: false, free: false, creator: true },
  { label: "Multiple brand presets", anonymous: false, free: false, creator: true },
  { label: "Multiple animated logo", anonymous: false, free: false, creator: true },
  { label: "Multiple logo effects", anonymous: false, free: false, creator: true },
  { label: "Curated color palette", anonymous: false, free: false, creator: true },
  { label: "Social media assets export", anonymous: false, free: false, creator: true },
  { label: "App Store & home screen previews", anonymous: false, free: false, creator: true },
  { label: "Logo variants (light/dark/transparent)", anonymous: false, free: false, creator: true },
  { label: "Priority support + Discord", anonymous: false, free: false, creator: true },
];

export const LOCKED_FREE_COUNT = FEATURES.filter(
  (f) => f.free && !f.anonymous,
).length;

export const TOTAL_FEATURES = FEATURES.length;
export const ANONYMOUS_COUNT = FEATURES.filter((f) => f.anonymous).length;
export const FREE_COUNT = FEATURES.filter((f) => f.free).length;
export const CREATOR_COUNT = FEATURES.filter((f) => f.creator).length;
