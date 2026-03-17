import type { Background } from "./logo.types";

export function getRandomLogoVisual(
  iconList: string[],
  fallbackIconName = "lucide:heart",
) {
  const background = randomBackground();
  return {
    iconName: iconList.length > 0 ? randomFrom(iconList) : fallbackIconName,
    iconColor: pickContrastingIconColor(background),
    background,
  };
}

function randomBackground(): Background {
  const tonalBand = Math.random() < 0.5 ? "dark" : "light";
  const baseHue = randomInt(0, 359);

  if (Math.random() < 0.45) {
    const solidLightness =
      tonalBand === "dark" ? randomInt(20, 38) : randomInt(62, 82);
    return {
      type: "solid",
      color: hslToHex(baseHue, randomInt(62, 92), solidLightness),
    };
  }

  const hueOffset = randomInt(24, 140) * (Math.random() < 0.5 ? -1 : 1);
  const hueB = normalizeHue(baseHue + hueOffset);
  const satA = randomInt(56, 90);
  const satB = randomInt(56, 90);
  const lightA = tonalBand === "dark" ? randomInt(22, 42) : randomInt(58, 80);
  const lightB = tonalBand === "dark" ? randomInt(18, 40) : randomInt(54, 78);

  return {
    type: "gradient",
    direction: randomInt(0, 359),
    stops: [
      { color: hslToHex(baseHue, satA, lightA), position: randomInt(0, 24) },
      { color: hslToHex(hueB, satB, lightB), position: randomInt(76, 100) },
    ],
  };
}

function pickContrastingIconColor(background: Background): string {
  const candidates = ["#FFFFFF", "#111111"];
  const contrastByCandidate = candidates.map((candidate) => {
    const minContrast =
      background.type === "solid"
        ? contrastRatio(candidate, background.color)
        : Math.min(
            contrastRatio(candidate, background.stops[0].color),
            contrastRatio(candidate, background.stops[1].color),
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
