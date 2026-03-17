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
    const stopsRaw = Array.isArray(bg.stops) ? bg.stops : [];
    const s0 = (stopsRaw[0] ?? {}) as Record<string, unknown>;
    const s1 = (stopsRaw[1] ?? {}) as Record<string, unknown>;
    return {
      type: "gradient",
      direction: clamp(bg.direction, 0, 360, 135),
      stops: [
        {
          color: safeColor(s0.color, "#6366f1"),
          position: clamp(s0.position, 0, 100, 0),
        },
        {
          color: safeColor(s1.color, "#a855f7"),
          position: clamp(s1.position, 0, 100, 100),
        },
      ],
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
    background: sanitizeBackground(v.background),
    borderRadius: clamp(v.borderRadius, 0, 256, DEFAULT_LOGO.borderRadius),
    borderWidth: clamp(v.borderWidth, 0, 24, DEFAULT_LOGO.borderWidth),
    borderColor: safeColor(v.borderColor, DEFAULT_LOGO.borderColor),
  };
}

export function areLogosEqual(a: LogoState, b: LogoState) {
  if (a.iconName !== b.iconName) return false;
  if (a.iconColor !== b.iconColor) return false;
  if (a.iconBorderColor !== b.iconBorderColor) return false;
  if (a.iconBorderWidth !== b.iconBorderWidth) return false;
  if (a.iconSize !== b.iconSize) return false;
  if (a.iconRotation !== b.iconRotation) return false;
  if (a.borderRadius !== b.borderRadius) return false;
  if (a.borderWidth !== b.borderWidth) return false;
  if (a.borderColor !== b.borderColor) return false;

  if (a.background.type !== b.background.type) return false;
  if (a.background.type === "solid" && b.background.type === "solid") {
    return a.background.color === b.background.color;
  }
  if (a.background.type === "gradient" && b.background.type === "gradient") {
    return (
      a.background.direction === b.background.direction &&
      a.background.stops[0].color === b.background.stops[0].color &&
      a.background.stops[0].position === b.background.stops[0].position &&
      a.background.stops[1].color === b.background.stops[1].color &&
      a.background.stops[1].position === b.background.stops[1].position
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
      bg.stops.length !== 2
    ) {
      return false;
    }
    const [a, b] = bg.stops as Array<Record<string, unknown>>;
    return (
      typeof a?.color === "string" &&
      typeof a?.position === "number" &&
      typeof b?.color === "string" &&
      typeof b?.position === "number"
    );
  }
  return false;
}
