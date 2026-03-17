import { ICON_SETS } from "#/domain/icon/icon.types";
import { getRandomLogoVisual } from "#/domain/logo/logo.randomizer";
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

export async function randomizeLogo(options: {
  icon: boolean;
  background: boolean;
}) {
  if (!options.icon && !options.background) return;

  const { present } = useLogoStore.getState();
  const prefix = options.icon ? randomPrefix() : present.iconName.split(":")[0];
  const icons = await fetchAllIconsForPrefix(prefix);
  const next = getRandomLogoVisual(icons, present.iconName);

  updateLogo((d) => {
    d.iconBorderWidth = 0;
    if (options.icon) d.iconName = next.iconName;
    if (options.background) d.background = next.background;
    if (options.icon && options.background) d.iconColor = next.iconColor;
  });
}
