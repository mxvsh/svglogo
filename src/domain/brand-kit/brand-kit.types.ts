export type BrandKitStyle = "minimal" | "gradient" | "dark";
export type BrandKitLayout = "centered" | "landscape";

export interface SocialTextOptions {
  title?: string;
  tagline?: string;
  fontFamily?: string;
  fontWeight?: number;
  textColor?: string;
  layout: BrandKitLayout;
}
