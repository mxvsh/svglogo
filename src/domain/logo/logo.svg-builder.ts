import { getIconOutlineOffsets } from "#/domain/icon/icon.outline";
import { getFontByFamily } from "./logo.fonts";
import type { Background, LogoState } from "./logo.types";

export function buildBackgroundStyle(bg: Background): string {
	if (bg.type === "transparent") return "transparent";
	if (bg.type === "solid") return bg.color;
	const { direction, stops } = bg;
	return `linear-gradient(${direction}deg, ${stops.map((s: { color: string; position: number }) => `${s.color} ${s.position}%`).join(", ")})`;
}

export function buildBackgroundCss(bg: Background): React.CSSProperties {
	if (bg.type === "transparent") {
		return { background: "transparent" };
	}
	if (bg.type === "solid") {
		return { background: bg.color };
	}
	const { direction, stops } = bg;
	return {
		background: `linear-gradient(${direction}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`,
	};
}

export type IconSvgCache = {
	iconSvgContent: string;
	borderSvgContent: string;
	iconSvgUri: string;
	borderSvgUri: string;
};

type InlinedSvgElement = {
	defs: string;
	content: string;
};

function getSvgAttribute(svgContent: string, name: string): string | null {
	const match = svgContent.match(new RegExp(`${name}="([^"]+)"`, "i"));
	return match ? match[1] : null;
}

function scopeSvgReferences(markup: string, uid: string): string {
	return markup
		.replace(/\bid="([^"]+)"/g, `id="${uid}-$1"`)
		.replace(/url\(#([^)]+)\)/g, `url(#${uid}-$1)`)
		.replace(/href="#([^"]+)"/g, `href="#${uid}-$1"`)
		.replace(/xlink:href="#([^"]+)"/g, `xlink:href="#${uid}-$1"`);
}

function parseViewBox(viewBox: string | null, fallbackSize: number) {
	const parts = viewBox
		?.trim()
		.split(/[\s,]+/)
		.map((value) => Number.parseFloat(value));
	if (
		!parts ||
		parts.length !== 4 ||
		parts.some((value) => !Number.isFinite(value))
	) {
		return { minX: 0, minY: 0, width: fallbackSize, height: fallbackSize };
	}
	const [minX, minY, width, height] = parts;
	return { minX, minY, width, height };
}

function inlineSvgElement(
	svgContent: string,
	x: number,
	y: number,
	size: number,
	uid: string,
): InlinedSvgElement {
	if (!svgContent) return { defs: "", content: "" };

	const viewBox = parseViewBox(getSvgAttribute(svgContent, "viewBox"), size);
	const preserveAspectRatio =
		getSvgAttribute(svgContent, "preserveAspectRatio") ?? "xMidYMid meet";
	const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
	let inner = innerMatch ? innerMatch[1].trim() : "";

	const defsMatches = [...inner.matchAll(/<defs\b[^>]*>([\s\S]*?)<\/defs>/gi)];
	const defs = defsMatches
		.map((match) => match[1]?.trim() ?? "")
		.filter(Boolean)
		.join("\n");
	inner = inner.replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/gi, "").trim();

	const scopedDefs = defs ? scopeSvgReferences(defs, uid) : "";
	const scopedInner = scopeSvgReferences(inner, uid);

	let scaleX = size / viewBox.width;
	let scaleY = size / viewBox.height;
	let translateX = x;
	let translateY = y;

	if (!preserveAspectRatio.includes("none")) {
		const scale = Math.min(scaleX, scaleY);
		const extraX = size - viewBox.width * scale;
		const extraY = size - viewBox.height * scale;
		scaleX = scale;
		scaleY = scale;
		if (preserveAspectRatio.includes("xMid")) translateX += extraX / 2;
		else if (preserveAspectRatio.includes("xMax")) translateX += extraX;
		if (preserveAspectRatio.includes("YMid")) translateY += extraY / 2;
		else if (preserveAspectRatio.includes("YMax")) translateY += extraY;
	}

	return {
		defs: scopedDefs,
		content: scopedInner
			? `<g transform="translate(${translateX} ${translateY}) scale(${scaleX} ${scaleY}) translate(${-viewBox.minX} ${-viewBox.minY})">${scopedInner}</g>`
			: "",
	};
}

export function buildCanvasSvgSync(
	state: LogoState,
	cache: IconSvgCache,
	size = 512,
): string {
	const {
		iconSize,
		iconRotation,
		iconOffsetX,
		iconOffsetY,
		iconBorderWidth,
		background,
		borderRadius,
		borderWidth,
		borderColor,
	} = state;
	const { iconSvgContent, borderSvgContent } = cache;

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
	const safeOffsetX = Number.isFinite(iconOffsetX) ? Math.min(50, Math.max(-50, iconOffsetX)) : 0;
	const safeOffsetY = Number.isFinite(iconOffsetY) ? Math.min(50, Math.max(-50, iconOffsetY)) : 0;
	const offsetXPx = Math.round((safeOffsetX / 100) * size);
	const offsetYPx = Math.round((safeOffsetY / 100) * size);
	const iconOutlineOffsets = getIconOutlineOffsets(safeIconBorderWidth);

	let bgDef = "";
	let bgFill = "";
	if (background.type === "transparent") {
		bgFill = "none";
	} else if (background.type === "solid") {
		bgFill = background.color;
	} else {
		const { direction, stops } = background;
		const rad = (direction * Math.PI) / 180;
		const x1 = 50 - 50 * Math.cos(rad + Math.PI / 2);
		const y1 = 50 - 50 * Math.sin(rad + Math.PI / 2);
		const x2 = 50 + 50 * Math.cos(rad + Math.PI / 2);
		const y2 = 50 + 50 * Math.sin(rad + Math.PI / 2);
		bgDef = `<linearGradient id="bg-grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        ${stops.map((s) => `<stop offset="${s.position}%" stop-color="${s.color}"/>`).join("\n        ")}
      </linearGradient>`;
		bgFill = "url(#bg-grad)";
	}

	const borderAttr =
		safeBorderWidth > 0
			? `stroke="${borderColor}" stroke-width="${safeBorderWidth * 2}"`
			: "";

	let iconDefs = "";
	let clippedBorderIcon = "";
	let clippedIcon = "";

	if (state.textMode && state.logoText) {
		const font = getFontByFamily(state.fontFamily);
		const fontWeight = font?.weight ?? 700;
		const fontSize = Math.round(iconPx * 0.65);
		const escaped = state.logoText
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

		const textX = size / 2 + offsetXPx;
		const textY = size / 2 + offsetYPx;

		if (safeIconBorderWidth > 0 && iconOutlineOffsets.length > 0) {
			clippedBorderIcon = iconOutlineOffsets
				.map(
					(offset) =>
						`<text x="${textX + offset.x}" y="${textY + offset.y}" text-anchor="middle" dominant-baseline="central" font-family="'${state.fontFamily}', sans-serif" font-weight="${fontWeight}" font-size="${fontSize}" fill="${state.iconBorderColor}">${escaped}</text>`,
				)
				.join("");
		}

		clippedIcon = `<text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="central" font-family="'${state.fontFamily}', sans-serif" font-weight="${fontWeight}" font-size="${fontSize}" fill="${state.iconColor}">${escaped}</text>`;
	} else {
		const inlinedBorderIcons =
			borderSvgContent && iconOutlineOffsets.length > 0
				? iconOutlineOffsets.map((offset, index) =>
						inlineSvgElement(
							borderSvgContent,
							iconOffset + offsetXPx + offset.x,
							iconOffset + offsetYPx + offset.y,
							iconPx,
							`border-${index}`,
						),
					)
				: [];
		const inlinedIcon = iconSvgContent
			? inlineSvgElement(iconSvgContent, iconOffset + offsetXPx, iconOffset + offsetYPx, iconPx, "icon")
			: { defs: "", content: "" };
		iconDefs = [
			...inlinedBorderIcons.map((item) => item.defs),
			inlinedIcon.defs,
		]
			.filter(Boolean)
			.join("\n    ");
		clippedBorderIcon = inlinedBorderIcons
			.map((item) => item.content)
			.join("");
		clippedIcon = inlinedIcon.content;
	}
	const defs = [
		bgDef,
		`<clipPath id="canvas-clip">
      <rect width="${size}" height="${size}" rx="${safeBorderRadius}" ry="${safeBorderRadius}"/>
    </clipPath>`,
		iconDefs,
	]
		.filter(Boolean)
		.join("\n    ");

	return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    ${defs}
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
