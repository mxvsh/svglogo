import { createServerFn } from "@tanstack/react-start";
import { nanoid } from "nanoid";
import { env } from "cloudflare:workers";
import { sanitizeLogoState } from "#/domain/logo/logo.validators";

export const createShareFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { logoState: unknown })
  .handler(async ({ data }) => {
    const logo = sanitizeLogoState(data.logoState);
    const kv = (env as { SHARE_KV?: KVNamespace }).SHARE_KV;

    if (!kv) {
      throw new Error("SHARE_KV binding is not configured");
    }

    const id = nanoid(6);
    await kv.put(`share:${id}`, JSON.stringify(logo), {
      expirationTtl: 60 * 60 * 24 * 30, // 30 days
    });

    return { id };
  });
