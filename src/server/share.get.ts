import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import type { LogoState } from "#/domain/logo/logo.types";
import { sanitizeLogoState } from "#/domain/logo/logo.validators";

export const getSharedLogoFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => data as { id: string })
  .handler(async ({ data }): Promise<LogoState | null> => {
    const kv = (env as { SHARE_KV?: KVNamespace }).SHARE_KV;

    if (!kv) return null;

    const raw = await kv.get(`share:${data.id}`);
    if (!raw) return null;

    try {
      return sanitizeLogoState(JSON.parse(raw));
    } catch {
      return null;
    }
  });
