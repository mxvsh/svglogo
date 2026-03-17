import { getSharedLogoFn } from "#/server/share.get";

export async function fetchSharedLogo(id: string) {
  return getSharedLogoFn({ data: { id } });
}
