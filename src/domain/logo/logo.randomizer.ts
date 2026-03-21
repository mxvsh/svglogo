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

// Tweak these to change the feel of smart randomization
const SOLID_CHANCE = 0.3; // probability of solid vs gradient
const DARK_CHANCE = 0.6;  // probability of dark tones vs light

function randomBeautifulHue(): number {
  // Avoid 70–160° (yellow-green → green) — almost always looks bad in gradients
  // Sample from [0–69] ∪ [161–359], map linearly
  const n = randomInt(0, 268); // 70 + 199 - 1
  return n < 70 ? n : n + 91;
}

function randomBackgroundFromPalette(palette: string[]): { bg: Background; palette: string[] } {
  if (Math.random() < SOLID_CHANCE || palette.length < 2) {
    return { bg: { type: "solid", color: randomFrom(palette) }, palette };
  }
  const shuffled = [...palette].sort(() => Math.random() - 0.5);
  const stopCount = Math.min(shuffled.length, Math.random() < 0.6 ? 2 : 3);
  return {
    bg: {
      type: "gradient",
      direction: randomInt(90, 225),
      stops: shuffled.slice(0, stopCount).map((color, i) => ({
        color,
        position: Math.round((100 * i) / (stopCount - 1)),
      })),
    },
    palette,
  };
}

function randomBackground(): { bg: Background; palette?: string[] } {
  // Solid: pick a curated color from nice-color-palettes
  if (Math.random() < SOLID_CHANCE) {
    const palette = randomFrom(niceColorPalettes as string[][]);
    return { bg: { type: "solid", color: randomFrom(palette) }, palette };
  }

  const isDark = Math.random() < DARK_CHANCE;
  const baseHue = randomBeautifulHue();
  // Consistent saturation per gradient looks more intentional than per-stop variation
  const sat = randomInt(62, 90);
  const roll = Math.random();

  let hues: number[];
  if (roll < 0.45) {
    // Analogous 2-stop — most polished, always works
    hues = [baseHue, normalizeHue(baseHue + randomInt(20, 45))];
  } else if (roll < 0.7) {
    // Analogous 3-stop — rich, smooth
    const step = randomInt(18, 38);
    hues = [baseHue, normalizeHue(baseHue + step), normalizeHue(baseHue + step * 2)];
  } else if (roll < 0.88) {
    // Complementary — dramatic contrast
    hues = [baseHue, normalizeHue(baseHue + 180 + randomInt(-15, 15))];
  } else {
    // Split-complementary — interesting without being jarring
    hues = [
      baseHue,
      normalizeHue(baseHue + 150 + randomInt(-10, 10)),
      normalizeHue(baseHue + 210 + randomInt(-10, 10)),
    ];
  }

  // Vary lightness between stops so the gradient is clearly visible
  const baseLight = isDark ? randomInt(25, 42) : randomInt(54, 70);
  const spread = randomInt(8, 16);
  const lights = hues.map((_, i) =>
    Math.min(90, Math.max(10, baseLight + (i % 2 === 0 ? -spread : spread))),
  );

  return {
    bg: {
      type: "gradient",
      direction: randomInt(90, 225),
      stops: hues.map((h, i) => ({
        color: hslToHex(h, sat + randomInt(-4, 4), lights[i]),
        position: Math.round((100 * i) / (hues.length - 1)),
      })),
    },
  };
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

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = normalizeHue(h) / 360;
  const sNorm = clamp01(s / 100);
  const lNorm = clamp01(l / 100);

  if (sNorm === 0) {
    const gray = Math.round(lNorm * 255);
    return `#${toHex(gray)}${toHex(gray)}${toHex(gray)}`;
  }

  const q =
    lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;
  const r = hueToRgb(p, q, hNorm + 1 / 3);
  const g = hueToRgb(p, q, hNorm);
  const b = hueToRgb(p, q, hNorm - 1 / 3);
  return `#${toHex(Math.round(r * 255))}${toHex(Math.round(g * 255))}${toHex(
    Math.round(b * 255),
  )}`;
}

function hueToRgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, "0");
}

function randomFrom<T>(list: T[]): T {
  return list[randomInt(0, list.length - 1)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
