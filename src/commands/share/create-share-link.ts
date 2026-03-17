import { useLogoStore } from "#/store/logo-store";
import { createShareFn } from "#/server/share.create";

export async function createShareLink(): Promise<string> {
  const logo = useLogoStore.getState().present;
  const result = await createShareFn({ data: { logoState: logo } });
  return `${window.location.origin}?s=${result.id}`;
}
