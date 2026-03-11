import type { Background, LogoState } from "#/store/logoStore";

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

/** Fetch icon SVG from Iconify API and embed it */
export async function buildCanvasSvg(
	state: LogoState,
	size = 512,
): Promise<string> {
	const {
		iconName,
		iconColor,
		iconSize,
		background,
		borderRadius,
		borderWidth,
		borderColor,
	} = state;

	const iconPx = Math.round((iconSize / 100) * size);
	const iconOffset = Math.round((size - iconPx) / 2);

	// Fetch icon SVG from iconify
	const [prefix, name] = iconName.split(":");
	let iconSvgContent = "";
	try {
		const res = await fetch(
			`https://api.iconify.design/${prefix}/${name}.svg?color=${encodeURIComponent(iconColor)}&width=${iconPx}&height=${iconPx}`,
		);
		iconSvgContent = await res.text();
		// Extract inner content from the SVG wrapper
	} catch {
		iconSvgContent = "";
	}

	// Build background definition
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
		borderWidth > 0
			? `stroke="${borderColor}" stroke-width="${borderWidth * 2}"`
			: "";

	// Clip the icon SVG within the canvas
	const clippedIcon = iconSvgContent
		? `<image href="data:image/svg+xml,${encodeURIComponent(iconSvgContent)}" x="${iconOffset}" y="${iconOffset}" width="${iconPx}" height="${iconPx}"/>`
		: "";

	return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bgDef}
  <defs>
    <clipPath id="canvas-clip">
      <rect width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}"/>
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="${bgFill}" ${borderAttr} clip-path="url(#canvas-clip)"/>
  <g clip-path="url(#canvas-clip)">
    ${clippedIcon}
  </g>
</svg>`;
}
