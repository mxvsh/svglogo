import niceColorPalettes from "nice-color-palettes";
import type { Background } from "./logo.types";

// Border radii that always look intentional and clean
const SAFE_BORDER_RADII = [16, 24, 32, 48, 64, 96, 112, 128, 200, 256];
const SAFE_ICON_SIZES = [48, 52, 56, 60, 64];

export function getSmartLogoVisual(
  iconList: string[],
  fallbackIconName = "lucide:heart",
  brandPalette?: string[],
) {
  const { bg, palette } = brandPalette?.length
    ? randomBackgroundFromPalette(brandPalette)
    : randomBackground();
  return {
    iconName: iconList.length > 0 ? randomFrom(iconList) : fallbackIconName,
    iconColor: pickIconColor(bg, palette),
    iconBorderWidth: 0,
    iconSize: randomFrom(SAFE_ICON_SIZES),
    iconRotation: 0,
    borderRadius: randomFrom(SAFE_BORDER_RADII),
    borderWidth: 0,
    background: bg,
  };
}

export function getRandomLogoVisual(
  iconList: string[],
  fallbackIconName = "lucide:heart",
  brandPalette?: string[],
) {
  const { bg, palette } = brandPalette?.length
    ? randomBackgroundFromPalette(brandPalette)
    : randomBackground();
  return {
    iconName: iconList.length > 0 ? randomFrom(iconList) : fallbackIconName,
    iconColor: pickIconColor(bg, palette),
    background: bg,
  };
}

const SOLID_CHANCE = 0.25;

function gradientFromColors(colors: string[]): Background {
  // Sort by lightness so the gradient always transitions clearly
  const sorted = [...colors].sort((a, b) => relativeLuminance(a) - relativeLuminance(b));
  const stopCount = Math.min(sorted.length, Math.random() < 0.6 ? 2 : 3);
  const stops = sorted.slice(0, stopCount);
  return {
    type: "gradient",
    direction: randomInt(90, 225),
    stops: stops.map((color, i) => ({
      color,
      position: Math.round((100 * i) / (stopCount - 1)),
    })),
  };
}

function randomBackgroundFromPalette(palette: string[]): { bg: Background; palette: string[] } {
  if (Math.random() < SOLID_CHANCE || palette.length < 2) {
    return { bg: { type: "solid", color: randomFrom(palette) }, palette };
  }
  const shuffled = [...palette].sort(() => Math.random() - 0.5);
  return { bg: gradientFromColors(shuffled), palette };
}

function randomBackground(): { bg: Background; palette: string[] } {
  const palette = randomFrom(niceColorPalettes as string[][]);
  if (Math.random() < SOLID_CHANCE) {
    return { bg: { type: "solid", color: randomFrom(palette) }, palette };
  }
  return { bg: gradientFromColors(palette), palette };
}

function pickIconColor(background: Background, palette?: string[]): string {
  // For solid backgrounds, try palette colors first — more interesting than just white/black
  if (background.type === "solid" && palette && palette.length > 1) {
    const bg = background.color;
    const candidates = palette.filter((c) => c.toLowerCase() !== bg.toLowerCase());
    // Pick the palette color with the highest contrast against the background
    const best = candidates.reduce((a, b) =>
      contrastRatio(a, bg) >= contrastRatio(b, bg) ? a : b,
    );
    // Only use it if contrast is sufficient (≥3), otherwise fall back to white/black
    if (contrastRatio(best, bg) >= 3) return best;
  }
  return pickContrastingIconColor(background);
}

function pickContrastingIconColor(background: Background): string {
  const candidates = ["#FFFFFF", "#111111"];
  const contrastByCandidate = candidates.map((candidate) => {
    const minContrast =
      background.type === "solid"
        ? contrastRatio(candidate, background.color)
        : Math.min(
            ...background.stops.map((s) => contrastRatio(candidate, s.color)),
          );
    return { candidate, minContrast };
  });

  contrastByCandidate.sort((a, b) => b.minContrast - a.minContrast);
  return contrastByCandidate[0].candidate;
}

function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r / 255, g / 255, b / 255];
  const linear = srgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "").trim();
  if (value.length === 3) {
    return {
      r: Number.parseInt(value[0] + value[0], 16),
      g: Number.parseInt(value[1] + value[1], 16),
      b: Number.parseInt(value[2] + value[2], 16),
    };
  }
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function randomFrom<T>(list: T[]): T {
  return list[randomInt(0, list.length - 1)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
