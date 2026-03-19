import { getIconOutlineOffsets } from "#/domain/icon/icon.outline";
import type { Background, LogoState } from "./logo.types";

export function buildBackgroundStyle(bg: Background): string {
	if (bg.type === "solid") return bg.color;
	const { direction, stops } = bg;
	return `linear-gradient(${direction}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
}

export function buildBackgroundCss(bg: Background): React.CSSProperties {
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
		bgDef = `<linearGradient id="bg-grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        ${stops.map((s) => `<stop offset="${s.position}%" stop-color="${s.color}"/>`).join("\n        ")}
      </linearGradient>`;
		bgFill = "url(#bg-grad)";
	}

	const borderAttr =
		safeBorderWidth > 0
			? `stroke="${borderColor}" stroke-width="${safeBorderWidth * 2}"`
			: "";

	const inlinedBorderIcons =
		borderSvgContent && iconOutlineOffsets.length > 0
			? iconOutlineOffsets.map((offset, index) =>
					inlineSvgElement(
						borderSvgContent,
						iconOffset + offset.x,
						iconOffset + offset.y,
						iconPx,
						`border-${index}`,
					),
				)
			: [];
	const inlinedIcon = iconSvgContent
		? inlineSvgElement(iconSvgContent, iconOffset, iconOffset, iconPx, "icon")
		: { defs: "", content: "" };
	const iconDefs = [
		...inlinedBorderIcons.map((item) => item.defs),
		inlinedIcon.defs,
	]
		.filter(Boolean)
		.join("\n    ");
	const clippedBorderIcon = inlinedBorderIcons
		.map((item) => item.content)
		.join("");
	const clippedIcon = inlinedIcon.content;
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
