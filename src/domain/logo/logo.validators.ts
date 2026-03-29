import { DEFAULT_LOGO, type Background, type LogoState } from "./logo.types";

export function clamp(
  n: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function safeColor(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function sanitizeBackground(value: unknown): Background {
  if (!value || typeof value !== "object") return DEFAULT_LOGO.background;
  const bg = value as Record<string, unknown>;

  if (bg.type === "transparent") {
    return { type: "transparent" };
  }

  if (bg.type === "solid") {
    return {
      type: "solid",
      color: safeColor(
        bg.color,
        DEFAULT_LOGO.background.type === "solid"
          ? DEFAULT_LOGO.background.color
          : "#E82C4E",
      ),
    };
  }

  if (bg.type === "gradient") {
    const stopsRaw = Array.isArray(bg.stops) && bg.stops.length >= 2 ? bg.stops : [];
    const sanitizedStops = stopsRaw.map((s: unknown, i: number) => {
      const raw = (s ?? {}) as Record<string, unknown>;
      return {
        color: safeColor(raw.color, i === 0 ? "#6366f1" : "#a855f7"),
        position: clamp(raw.position, 0, 100, i === 0 ? 0 : 100),
      };
    });
    const stops = sanitizedStops.length >= 2 ? sanitizedStops : [
      { color: "#6366f1", position: 0 },
      { color: "#a855f7", position: 100 },
    ];
    return {
      type: "gradient",
      direction: clamp(bg.direction, 0, 360, 135),
      stops,
    };
  }

  return DEFAULT_LOGO.background;
}

export function sanitizeLogoState(value: unknown): LogoState {
  if (!value || typeof value !== "object") return DEFAULT_LOGO;
  const v = value as Record<string, unknown>;
  return {
    iconName:
      typeof v.iconName === "string" && v.iconName.includes(":")
        ? v.iconName
        : DEFAULT_LOGO.iconName,
    iconColor: safeColor(v.iconColor, DEFAULT_LOGO.iconColor),
    iconBorderColor: safeColor(
      v.iconBorderColor,
      DEFAULT_LOGO.iconBorderColor,
    ),
    iconBorderWidth: clamp(
      v.iconBorderWidth,
      0,
      24,
      DEFAULT_LOGO.iconBorderWidth,
    ),
    iconSize: clamp(v.iconSize, 10, 90, DEFAULT_LOGO.iconSize),
    iconRotation: clamp(v.iconRotation, 0, 360, DEFAULT_LOGO.iconRotation),
    iconOffsetX: clamp(v.iconOffsetX, -50, 50, 0),
    iconOffsetY: clamp(v.iconOffsetY, -50, 50, 0),
    background: sanitizeBackground(v.background),
    borderRadius: clamp(v.borderRadius, 0, 256, DEFAULT_LOGO.borderRadius),
    borderWidth: clamp(v.borderWidth, 0, 24, DEFAULT_LOGO.borderWidth),
    borderColor: safeColor(v.borderColor, DEFAULT_LOGO.borderColor),
    textMode: typeof v.textMode === "boolean" ? v.textMode : false,
    logoText: typeof v.logoText === "string" ? v.logoText : "",
    fontFamily: typeof v.fontFamily === "string" && v.fontFamily.length > 0
      ? v.fontFamily
      : DEFAULT_LOGO.fontFamily,
  };
}

export function areLogosEqual(a: LogoState, b: LogoState) {
  if (a.iconName !== b.iconName) return false;
  if (a.iconColor !== b.iconColor) return false;
  if (a.iconBorderColor !== b.iconBorderColor) return false;
  if (a.iconBorderWidth !== b.iconBorderWidth) return false;
  if (a.iconSize !== b.iconSize) return false;
  if (a.iconRotation !== b.iconRotation) return false;
  if (a.iconOffsetX !== b.iconOffsetX) return false;
  if (a.iconOffsetY !== b.iconOffsetY) return false;
  if (a.borderRadius !== b.borderRadius) return false;
  if (a.borderWidth !== b.borderWidth) return false;
  if (a.borderColor !== b.borderColor) return false;
  if (a.textMode !== b.textMode) return false;
  if (a.logoText !== b.logoText) return false;
  if (a.fontFamily !== b.fontFamily) return false;

  if (a.background.type !== b.background.type) return false;
  if (a.background.type === "transparent") return true;
  if (a.background.type === "solid" && b.background.type === "solid") {
    return a.background.color === b.background.color;
  }
  if (a.background.type === "gradient" && b.background.type === "gradient") {
    if (a.background.direction !== b.background.direction) return false;
    if (a.background.stops.length !== b.background.stops.length) return false;
    return a.background.stops.every(
      (s, i) =>
        s.color === (b.background as Extract<typeof b.background, { type: "gradient" }>).stops[i].color &&
        s.position === (b.background as Extract<typeof b.background, { type: "gradient" }>).stops[i].position,
    );
  }
  return false;
}

export function isLogoStateLike(value: unknown): value is {
  iconName: string;
  iconColor: string;
  iconSize: number;
  background:
    | { type: "solid"; color: string }
    | {
        type: "gradient";
        direction: number;
        stops: [
          { color: string; position: number },
          { color: string; position: number },
        ];
      };
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
} {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (
    typeof v.iconName !== "string" ||
    typeof v.iconColor !== "string" ||
    typeof v.iconSize !== "number" ||
    typeof v.borderRadius !== "number" ||
    typeof v.borderWidth !== "number" ||
    typeof v.borderColor !== "string" ||
    !v.background ||
    typeof v.background !== "object"
  ) {
    return false;
  }

  const bg = v.background as Record<string, unknown>;
  if (bg.type === "solid") {
    return typeof bg.color === "string";
  }
  if (bg.type === "gradient") {
    if (
      typeof bg.direction !== "number" ||
      !Array.isArray(bg.stops) ||
      bg.stops.length < 2
    ) {
      return false;
    }
    return (bg.stops as Array<Record<string, unknown>>).every(
      (s) => typeof s?.color === "string" && typeof s?.position === "number",
    );
  }
  return false;
}
