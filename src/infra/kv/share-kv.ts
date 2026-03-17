import type { LogoState } from "#/domain/logo/logo.types";

export async function getSharedLogo(
  kv: KVNamespace,
  id: string,
): Promise<LogoState | null> {
  const raw = await kv.get(`share:${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LogoState;
  } catch {
    return null;
  }
}

export async function putSharedLogo(
  kv: KVNamespace,
  id: string,
  logo: LogoState,
): Promise<void> {
  await kv.put(`share:${id}`, JSON.stringify(logo), {
    expirationTtl: 60 * 60 * 24 * 30, // 30 days
  });
}
