import { RANDOMIZE_ICON_SET_IDS } from "#/domain/icon/icon.types";
import { FREE_FONTS } from "#/domain/logo/logo.fonts";
import { getRandomLogoVisual, getSmartLogoVisual } from "#/domain/logo/logo.randomizer";
import { fetchCollection } from "#/infra/iconify/iconify-client";
import { useLogoStore } from "#/store/logo-store";
import { updateLogo } from "./update-logo";

function randomFont(): string {
  return FREE_FONTS[Math.floor(Math.random() * FREE_FONTS.length)].family;
}

function randomPrefix(): string {
  return RANDOMIZE_ICON_SET_IDS[Math.floor(Math.random() * RANDOMIZE_ICON_SET_IDS.length)];
}

const iconCollectionCache = new Map<string, string[]>();

async function fetchAllIconsForPrefix(prefix: string): Promise<string[]> {
  const cached = iconCollectionCache.get(prefix);
  if (cached) return cached;

  const icons = await fetchCollection(prefix);
  iconCollectionCache.set(prefix, icons);
  return icons;
}

export interface RandomizeStats {
  total: number;
  smart: number;
  custom: number;
  icon: number;
  iconColor: number;
  background: number;
  font: number;
  textMode: number;
}

const STATS_KEY = "svglogo-randomize-stats";

export function getRandomizeStats(): RandomizeStats {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}");
  } catch {
    return { total: 0, smart: 0, custom: 0, icon: 0, iconColor: 0, background: 0, font: 0, textMode: 0 };
  }
}

function bumpStats(patch: Partial<RandomizeStats>) {
  const prev = getRandomizeStats();
  const next: RandomizeStats = {
    total: (prev.total ?? 0) + (patch.total ?? 0),
    smart: (prev.smart ?? 0) + (patch.smart ?? 0),
    custom: (prev.custom ?? 0) + (patch.custom ?? 0),
    icon: (prev.icon ?? 0) + (patch.icon ?? 0),
    iconColor: (prev.iconColor ?? 0) + (patch.iconColor ?? 0),
    background: (prev.background ?? 0) + (patch.background ?? 0),
    font: (prev.font ?? 0) + (patch.font ?? 0),
    textMode: (prev.textMode ?? 0) + (patch.textMode ?? 0),
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
}

export async function randomizeLogo(
  options:
    | { smart: true; palette?: string[]; iconPrefix?: string; preloadedIcons?: string[] }
    | { smart?: false; icon: boolean; iconColor: boolean; background: boolean; font?: boolean; palette?: string[]; iconPrefix?: string; preloadedIcons?: string[] },
) {
  const { present } = useLogoStore.getState();
  const prefix = options.iconPrefix || randomPrefix();
  const icons = options.preloadedIcons?.length
    ? options.preloadedIcons
    : await fetchAllIconsForPrefix(prefix);

  if (options.smart) {
    bumpStats({ total: 1, smart: 1, textMode: present.textMode ? 1 : 0 });
    const next = getSmartLogoVisual(icons, present.iconName, options.palette);
    updateLogo((d) => {
      if (!present.textMode) {
        d.iconName = next.iconName;
        d.iconColor = next.iconColor;
        d.iconBorderWidth = next.iconBorderWidth;
        d.iconSize = next.iconSize;
        d.iconRotation = next.iconRotation;
      } else {
        d.fontFamily = randomFont();
        d.iconColor = next.iconColor;
      }
      d.borderRadius = next.borderRadius;
      d.borderWidth = next.borderWidth;
      d.background = next.background;
    });
    return;
  }

  if (!options.icon && !options.iconColor && !options.background && !options.font) return;

  bumpStats({
    total: 1,
    custom: 1,
    icon: options.icon ? 1 : 0,
    iconColor: options.iconColor ? 1 : 0,
    background: options.background ? 1 : 0,
    font: options.font ? 1 : 0,
    textMode: present.textMode ? 1 : 0,
  });

  const next = getRandomLogoVisual(icons, present.iconName, options.palette);
  updateLogo((d) => {
    d.iconBorderWidth = 0;
    if (options.icon) d.iconName = next.iconName;
    if (options.iconColor) d.iconColor = next.iconColor;
    if (options.background) d.background = next.background;
    if (options.font) d.fontFamily = randomFont();
  });
}
