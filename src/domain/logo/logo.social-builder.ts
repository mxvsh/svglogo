import type { Background } from "./logo.types";
import type { SocialTextOptions } from "#/domain/brand-kit/brand-kit.types";
import { getFontByFamily, getFontGoogleUrl } from "./logo.fonts";

function buildSvgBackground(bg: Background): { defs: string; fill: string } {
  if (bg.type === "solid") {
    return { defs: "", fill: bg.color };
  }

  const { direction, stops } = bg;
  const rad = (direction * Math.PI) / 180;
  const x1 = 50 - 50 * Math.cos(rad + Math.PI / 2);
  const y1 = 50 - 50 * Math.sin(rad + Math.PI / 2);
  const x2 = 50 + 50 * Math.cos(rad + Math.PI / 2);
  const y2 = 50 + 50 * Math.sin(rad + Math.PI / 2);

  const defs = `<linearGradient id="social-bg" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
    ${stops.map((s) => `<stop offset="${s.position}%" stop-color="${s.color}"/>`).join("\n    ")}
  </linearGradient>`;

  return { defs, fill: "url(#social-bg)" };
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildSocialSvg(
  logoSvg: string,
  background: Background,
  width: number,
  height: number,
  textOptions?: SocialTextOptions,
): string {
  const { defs: bgDefs, fill } = buildSvgBackground(background);
  const hasText = textOptions && (textOptions.title || textOptions.tagline);
  const min = Math.min(width, height);

  // Logo positioning depends on layout and whether text is present
  let logoSize: number;
  let logoX: number;
  let logoY: number;

  if (!hasText) {
    logoSize = Math.round(min * 0.4);
    logoX = Math.round((width - logoSize) / 2);
    logoY = Math.round((height - logoSize) / 2);
  } else if (textOptions.layout === "landscape") {
    logoSize = Math.round(min * 0.35);
    logoX = Math.round(width * 0.12);
    logoY = Math.round((height - logoSize) / 2);
  } else {
    // centered with text — logo moves up
    logoSize = Math.round(min * 0.3);
    logoX = Math.round((width - logoSize) / 2);
    logoY = Math.round(height * 0.18);
  }

  const vbMatch = logoSvg.match(/viewBox="([^"]*)"/);
  const viewBox = vbMatch?.[1] ?? "0 0 512 512";

  const nestedSvg = logoSvg
    .replace(/\bwidth="[^"]*"/, `width="${logoSize}"`)
    .replace(/\bheight="[^"]*"/, `height="${logoSize}"`)
    .replace(/viewBox="[^"]*"/, `viewBox="${viewBox}" x="${logoX}" y="${logoY}"`);

  // Build text elements
  let textElements = "";
  let fontStyle = "";

  if (hasText) {
    const family = textOptions.fontFamily ?? "Inter";
    const weight = textOptions.fontWeight ?? (getFontByFamily(family)?.weight ?? 700);
    const color = textOptions.textColor ?? "#FFFFFF";
    const titleSize = Math.round(min * 0.06);
    const taglineSize = Math.round(min * 0.035);

    fontStyle = `<style>@import url('${getFontGoogleUrl(family, weight)}');</style>`;

    if (textOptions.layout === "landscape") {
      const textX = logoX + logoSize + Math.round(width * 0.05);
      const centerY = height / 2;

      if (textOptions.title && textOptions.tagline) {
        const gap = titleSize * 0.4;
        textElements += `<text x="${textX}" y="${centerY - gap}" dominant-baseline="auto" font-family="'${family}', sans-serif" font-weight="${weight}" font-size="${titleSize}" fill="${color}">${escapeXml(textOptions.title)}</text>`;
        textElements += `<text x="${textX}" y="${centerY + taglineSize + gap}" dominant-baseline="auto" font-family="'${family}', sans-serif" font-weight="400" font-size="${taglineSize}" fill="${color}" opacity="0.7">${escapeXml(textOptions.tagline)}</text>`;
      } else if (textOptions.title) {
        textElements += `<text x="${textX}" y="${centerY}" dominant-baseline="central" font-family="'${family}', sans-serif" font-weight="${weight}" font-size="${titleSize}" fill="${color}">${escapeXml(textOptions.title)}</text>`;
      } else if (textOptions.tagline) {
        textElements += `<text x="${textX}" y="${centerY}" dominant-baseline="central" font-family="'${family}', sans-serif" font-weight="400" font-size="${taglineSize}" fill="${color}" opacity="0.7">${escapeXml(textOptions.tagline)}</text>`;
      }
    } else {
      // centered layout
      const textCenterX = width / 2;
      let textY = logoY + logoSize + Math.round(min * 0.06);

      if (textOptions.title) {
        textElements += `<text x="${textCenterX}" y="${textY}" text-anchor="middle" dominant-baseline="hanging" font-family="'${family}', sans-serif" font-weight="${weight}" font-size="${titleSize}" fill="${color}">${escapeXml(textOptions.title)}</text>`;
        textY += titleSize + Math.round(min * 0.02);
      }
      if (textOptions.tagline) {
        textElements += `<text x="${textCenterX}" y="${textY}" text-anchor="middle" dominant-baseline="hanging" font-family="'${family}', sans-serif" font-weight="400" font-size="${taglineSize}" fill="${color}" opacity="0.7">${escapeXml(textOptions.tagline)}</text>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}">
  <defs>${bgDefs}${fontStyle}</defs>
  <rect width="${width}" height="${height}" fill="${fill}"/>
  ${nestedSvg}
  ${textElements}
</svg>`;
}
