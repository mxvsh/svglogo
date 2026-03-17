import { getIconOutlineOffsets } from "#/domain/icon/icon.outline";
import type { Background, LogoState } from "./logo.types";

export function buildBackgroundStyle(bg: Background): string {
  if (bg.type === "solid") return bg.color;
  const { direction, stops } = bg;
  return `linear-gradient(${direction}deg, ${stops[0].color} ${stops[0].position}%, ${stops[1].color} ${stops[1].position}%)`;
}

export function buildBackgroundCss(bg: Background): React.CSSProperties {
  if (bg.type === "solid") {
    return { background: bg.color };
  }
  const { direction, stops } = bg;
  return {
    background: `linear-gradient(${direction}deg, ${stops[0].color} ${stops[0].position}%, ${stops[1].color} ${stops[1].position}%)`,
  };
}

export type IconSvgCache = {
  iconSvgContent: string;
  borderSvgContent: string;
  iconSvgUri: string;
  borderSvgUri: string;
};

export function buildCanvasSvgSync(
  state: LogoState,
  cache: IconSvgCache,
  size = 512,
): string {
  const {
    iconSize,
    iconRotation,
    iconBorderWidth,
    background,
    borderRadius,
    borderWidth,
    borderColor,
  } = state;
  const { iconSvgUri, borderSvgUri } = cache;

  const safeIconSize = Number.isFinite(iconSize)
    ? Math.min(90, Math.max(10, iconSize))
    : 60;
  const safeIconBorderWidth = Number.isFinite(iconBorderWidth)
    ? Math.min(24, Math.max(0, iconBorderWidth))
    : 0;
  const safeBorderWidth = Number.isFinite(borderWidth)
    ? Math.min(24, Math.max(0, borderWidth))
    : 0;
  const safeBorderRadius = Number.isFinite(borderRadius)
    ? Math.min(size / 2, Math.max(0, borderRadius))
    : 0;

  const iconPx = Math.round((safeIconSize / 100) * size);
  const iconOffset = Math.round((size - iconPx) / 2);
  const iconOutlineOffsets = getIconOutlineOffsets(safeIconBorderWidth);

  let bgDef = "";
  let bgFill = "";
  if (background.type === "solid") {
    bgFill = background.color;
  } else {
    const { direction, stops } = background;
    const rad = (direction * Math.PI) / 180;
    const x1 = 50 - 50 * Math.cos(rad + Math.PI / 2);
    const y1 = 50 - 50 * Math.sin(rad + Math.PI / 2);
    const x2 = 50 + 50 * Math.cos(rad + Math.PI / 2);
    const y2 = 50 + 50 * Math.sin(rad + Math.PI / 2);
    bgDef = `<defs>
      <linearGradient id="bg-grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="${stops[0].position}%" stop-color="${stops[0].color}"/>
        <stop offset="${stops[1].position}%" stop-color="${stops[1].color}"/>
      </linearGradient>
    </defs>`;
    bgFill = "url(#bg-grad)";
  }

  const borderAttr =
    safeBorderWidth > 0
      ? `stroke="${borderColor}" stroke-width="${safeBorderWidth * 2}"`
      : "";

  const clippedBorderIcon =
    borderSvgUri && iconOutlineOffsets.length > 0
      ? iconOutlineOffsets
          .map(
            (offset) =>
              `<image href="data:image/svg+xml,${borderSvgUri}" x="${iconOffset + offset.x}" y="${iconOffset + offset.y}" width="${iconPx}" height="${iconPx}"/>`,
          )
          .join("")
      : "";
  const clippedIcon = iconSvgUri
    ? `<image href="data:image/svg+xml,${iconSvgUri}" x="${iconOffset}" y="${iconOffset}" width="${iconPx}" height="${iconPx}"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bgDef}
  <defs>
    <clipPath id="canvas-clip">
      <rect width="${size}" height="${size}" rx="${safeBorderRadius}" ry="${safeBorderRadius}"/>
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${safeBorderRadius}" ry="${safeBorderRadius}" fill="${bgFill}" ${borderAttr} clip-path="url(#canvas-clip)"/>
  <g clip-path="url(#canvas-clip)">
    <g transform="rotate(${iconRotation ?? 0}, ${size / 2}, ${size / 2})">
      ${clippedBorderIcon}
      ${clippedIcon}
    </g>
  </g>
</svg>`;
}
