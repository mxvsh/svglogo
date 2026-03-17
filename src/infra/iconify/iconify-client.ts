import { getIconOutlineOffsets } from "#/domain/icon/icon.outline";
import type { IconSvgCache } from "#/domain/icon/icon.types";
import type { LogoState } from "#/domain/logo/logo.types";

const ICONIFY_BASE = "https://api.iconify.design";
const FETCH_SIZE = 256;

export async function fetchIconSvg(
  iconName: string,
  color: string,
  size: number,
): Promise<string> {
  const [prefix, name] = iconName.split(":");
  if (!prefix || !name) return "";
  try {
    const res = await fetch(
      `${ICONIFY_BASE}/${prefix}/${name}.svg?color=${encodeURIComponent(color)}&width=${size}&height=${size}`,
    );
    return await res.text();
  } catch {
    return "";
  }
}

export async function fetchIconSvgs(state: LogoState): Promise<IconSvgCache> {
  const { iconName, iconColor, iconBorderColor, iconBorderWidth } = state;
  const safeIconBorderWidth = Number.isFinite(iconBorderWidth)
    ? Math.min(24, Math.max(0, iconBorderWidth))
    : 0;
  const iconOutlineOffsets = getIconOutlineOffsets(safeIconBorderWidth);

  const [iconSvgContent, borderSvgContent] = await Promise.all([
    fetchIconSvg(iconName, iconColor, FETCH_SIZE),
    iconOutlineOffsets.length > 0
      ? fetchIconSvg(iconName, iconBorderColor, FETCH_SIZE)
      : Promise.resolve(""),
  ]);
  return {
    iconSvgContent,
    borderSvgContent,
    iconSvgUri: iconSvgContent ? encodeURIComponent(iconSvgContent) : "",
    borderSvgUri: borderSvgContent ? encodeURIComponent(borderSvgContent) : "",
  };
}

export async function fetchCollection(prefix: string): Promise<string[]> {
  const res = await fetch(`${ICONIFY_BASE}/collection?prefix=${prefix}`);
  const data = (await res.json()) as {
    uncategorized?: string[];
    categories?: Record<string, string[]>;
  };
  const uncategorized: string[] = data.uncategorized ?? [];
  const categorized: string[] = Object.values(
    data.categories ?? {},
  ).flat() as string[];
  const all = [...new Set([...uncategorized, ...categorized])];
  return all.map((n) => `${prefix}:${n}`);
}

export async function fetchGlobalSearch(query: string): Promise<string[]> {
  const res = await fetch(
    `${ICONIFY_BASE}/search?query=${encodeURIComponent(query)}&limit=128`,
  );
  const data = (await res.json()) as { icons?: string[] };
  return (data.icons ?? []) as string[];
}
