export interface ExportSize {
  size: number;
  filename: string;
}

export interface ExportPlatform {
  id: string;
  label: string;
  icon: string;
  description: string;
  sizes: ExportSize[];
  folder: string;
}

export const EXPORT_PLATFORMS: ExportPlatform[] = [
  {
    id: "ios",
    label: "iOS",
    icon: "simple-icons:apple",
    description: "10 sizes · AppIcon.appiconset",
    folder: "ios/AppIcon.appiconset",
    sizes: [
      { size: 20, filename: "icon-20.png" },
      { size: 40, filename: "icon-20@2x.png" },
      { size: 60, filename: "icon-20@3x.png" },
      { size: 58, filename: "icon-29@2x.png" },
      { size: 87, filename: "icon-29@3x.png" },
      { size: 80, filename: "icon-40@2x.png" },
      { size: 120, filename: "icon-40@3x.png" },
      { size: 120, filename: "icon-60@2x.png" },
      { size: 180, filename: "icon-60@3x.png" },
      { size: 1024, filename: "icon-1024.png" },
    ],
  },
  {
    id: "android",
    label: "Android",
    icon: "simple-icons:android",
    description: "6 sizes · mipmap folders",
    folder: "android",
    sizes: [
      { size: 48, filename: "mipmap-mdpi/ic_launcher.png" },
      { size: 72, filename: "mipmap-hdpi/ic_launcher.png" },
      { size: 96, filename: "mipmap-xhdpi/ic_launcher.png" },
      { size: 144, filename: "mipmap-xxhdpi/ic_launcher.png" },
      { size: 192, filename: "mipmap-xxxhdpi/ic_launcher.png" },
      { size: 512, filename: "play-store.png" },
    ],
  },
  {
    id: "macos",
    label: "macOS",
    icon: "simple-icons:macos",
    description: "10 sizes · AppIcon.appiconset",
    folder: "macos/AppIcon.appiconset",
    sizes: [
      { size: 16, filename: "icon_16x16.png" },
      { size: 32, filename: "icon_16x16@2x.png" },
      { size: 32, filename: "icon_32x32.png" },
      { size: 64, filename: "icon_32x32@2x.png" },
      { size: 128, filename: "icon_128x128.png" },
      { size: 256, filename: "icon_128x128@2x.png" },
      { size: 256, filename: "icon_256x256.png" },
      { size: 512, filename: "icon_256x256@2x.png" },
      { size: 512, filename: "icon_512x512.png" },
      { size: 1024, filename: "icon_512x512@2x.png" },
    ],
  },
  {
    id: "web",
    label: "Web / PWA",
    icon: "lucide:globe",
    description: "5 sizes · favicon + PWA icons",
    folder: "web",
    sizes: [
      { size: 16, filename: "favicon-16.png" },
      { size: 32, filename: "favicon-32.png" },
      { size: 180, filename: "apple-touch-icon.png" },
      { size: 192, filename: "icon-192.png" },
      { size: 512, filename: "icon-512.png" },
    ],
  },
];

export const IOS_CONTENTS_JSON = JSON.stringify(
  {
    images: [
      { size: "20x20", scale: "1x", filename: "icon-20.png", idiom: "iphone" },
      { size: "20x20", scale: "2x", filename: "icon-20@2x.png", idiom: "iphone" },
      { size: "20x20", scale: "3x", filename: "icon-20@3x.png", idiom: "iphone" },
      { size: "29x29", scale: "2x", filename: "icon-29@2x.png", idiom: "iphone" },
      { size: "29x29", scale: "3x", filename: "icon-29@3x.png", idiom: "iphone" },
      { size: "40x40", scale: "2x", filename: "icon-40@2x.png", idiom: "iphone" },
      { size: "40x40", scale: "3x", filename: "icon-40@3x.png", idiom: "iphone" },
      { size: "60x60", scale: "2x", filename: "icon-60@2x.png", idiom: "iphone" },
      { size: "60x60", scale: "3x", filename: "icon-60@3x.png", idiom: "iphone" },
      { size: "1024x1024", scale: "1x", filename: "icon-1024.png", idiom: "ios-marketing" },
    ],
    info: { author: "svglogo.dev", version: 1 },
  },
  null,
  2,
);

export const MACOS_CONTENTS_JSON = JSON.stringify(
  {
    images: [
      { size: "16x16", scale: "1x", filename: "icon_16x16.png", idiom: "mac" },
      { size: "16x16", scale: "2x", filename: "icon_16x16@2x.png", idiom: "mac" },
      { size: "32x32", scale: "1x", filename: "icon_32x32.png", idiom: "mac" },
      { size: "32x32", scale: "2x", filename: "icon_32x32@2x.png", idiom: "mac" },
      { size: "128x128", scale: "1x", filename: "icon_128x128.png", idiom: "mac" },
      { size: "128x128", scale: "2x", filename: "icon_128x128@2x.png", idiom: "mac" },
      { size: "256x256", scale: "1x", filename: "icon_256x256.png", idiom: "mac" },
      { size: "256x256", scale: "2x", filename: "icon_256x256@2x.png", idiom: "mac" },
      { size: "512x512", scale: "1x", filename: "icon_512x512.png", idiom: "mac" },
      { size: "512x512", scale: "2x", filename: "icon_512x512@2x.png", idiom: "mac" },
    ],
    info: { author: "svglogo.dev", version: 1 },
  },
  null,
  2,
);
