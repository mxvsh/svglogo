import { ICON_SETS } from "#/domain/icon/icon.types";
import { getRandomLogoVisual, getSmartLogoVisual } from "#/domain/logo/logo.randomizer";
import { fetchCollection } from "#/infra/iconify/iconify-client";
import { useLogoStore } from "#/store/logo-store";
import { updateLogo } from "./update-logo";

function randomPrefix(): string {
  return ICON_SETS[Math.floor(Math.random() * ICON_SETS.length)].id;
}

const iconCollectionCache = new Map<string, string[]>();

async function fetchAllIconsForPrefix(prefix: string): Promise<string[]> {
  const cached = iconCollectionCache.get(prefix);
  if (cached) return cached;

  const icons = await fetchCollection(prefix);
  iconCollectionCache.set(prefix, icons);
  return icons;
}

function bumpRandomizeCount() {
  const n = Number(localStorage.getItem("svglogo-randomize-count") ?? 0);
  localStorage.setItem("svglogo-randomize-count", String(n + 1));
}

export async function randomizeLogo(
  options:
    | { smart: true }
    | { smart?: false; icon: boolean; background: boolean },
) {
  const { present } = useLogoStore.getState();
  const prefix = randomPrefix();
  const icons = await fetchAllIconsForPrefix(prefix);

  bumpRandomizeCount();

  if (options.smart) {
    const next = getSmartLogoVisual(icons, present.iconName);
    updateLogo((d) => {
      d.iconName = next.iconName;
      d.iconColor = next.iconColor;
      d.iconBorderWidth = next.iconBorderWidth;
      d.iconSize = next.iconSize;
      d.iconRotation = next.iconRotation;
      d.borderRadius = next.borderRadius;
      d.borderWidth = next.borderWidth;
      d.background = next.background;
    });
    return;
  }

  if (!options.icon && !options.background) return;

  const next = getRandomLogoVisual(icons, present.iconName);
  updateLogo((d) => {
    d.iconBorderWidth = 0;
    if (options.icon) d.iconName = next.iconName;
    if (options.background) d.background = next.background;
    if (options.icon && options.background) d.iconColor = next.iconColor;
  });
}
