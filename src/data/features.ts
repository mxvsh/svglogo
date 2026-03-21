export interface Feature {
  label: string;
  icon: string;
  anonymous: boolean;
  free: boolean;
  creator: boolean;
}

export const FEATURES: Feature[] = [
  { label: "SVG, PNG, ICO export", icon: "lucide:download", anonymous: true, free: true, creator: true },
  { label: "300,000+ icons", icon: "lucide:smile", anonymous: true, free: true, creator: true },
  { label: "Multi-stop gradients", icon: "lucide:palette", anonymous: true, free: true, creator: true },
  { label: "Share with a link", icon: "lucide:link", anonymous: true, free: true, creator: true },
  { label: "Sync Collections", icon: "lucide:cloud", anonymous: false, free: true, creator: true },
  { label: "Unlimited advanced export", icon: "lucide:layers", anonymous: false, free: true, creator: true },
  { label: "Brand kit download", icon: "lucide:package", anonymous: false, free: false, creator: true },
  { label: "Premium fonts & icon sets", icon: "lucide:type", anonymous: false, free: false, creator: true },
  { label: "Export as code", icon: "lucide:code", anonymous: false, free: false, creator: true },
  { label: "Abstract logo generator", icon: "lucide:shapes", anonymous: false, free: false, creator: true },
  { label: "Transparent background", icon: "lucide:image", anonymous: false, free: false, creator: true },
  { label: "Infinite logo variations", icon: "lucide:infinity", anonymous: false, free: false, creator: true },
  { label: "Multiple brand presets", icon: "lucide:bookmark", anonymous: false, free: false, creator: true },
  { label: "Multiple animated logos", icon: "lucide:sparkles", anonymous: false, free: false, creator: true },
  { label: "Multiple logo effects", icon: "lucide:wand", anonymous: false, free: false, creator: true },
  { label: "Social media assets export", icon: "lucide:monitor-smartphone", anonymous: false, free: false, creator: true },
  { label: "App Store & home screen previews", icon: "lucide:smartphone", anonymous: false, free: false, creator: true },
  { label: "Logo variants (light/dark/transparent)", icon: "lucide:sun-moon", anonymous: false, free: false, creator: true },
  { label: "Priority support + Discord", icon: "lucide:headphones", anonymous: false, free: false, creator: true },
];

export const CREATOR_FEATURES = FEATURES.filter((f) => f.creator && !f.free);

export const LOCKED_FREE_COUNT = FEATURES.filter(
  (f) => f.free && !f.anonymous,
).length;

export const TOTAL_FEATURES = FEATURES.length;
export const ANONYMOUS_COUNT = FEATURES.filter((f) => f.anonymous).length;
export const FREE_COUNT = FEATURES.filter((f) => f.free).length;
export const CREATOR_COUNT = FEATURES.filter((f) => f.creator).length;
