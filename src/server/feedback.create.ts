import { createServerFn } from "@tanstack/react-start";
import { nanoid } from "nanoid";
import { env } from "cloudflare:workers";
import { getRequestIP } from "@tanstack/react-start/server";

interface RateLimiter {
  limit: (opts: { key: string }) => Promise<{ success: boolean }>;
}

export const createFeedbackFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { message: string; token: string })
  .handler(async ({ data }) => {
    const cfEnv = env as {
      FEEDBACK_KV?: KVNamespace;
      FEEDBACK_RL?: RateLimiter;
      TURNSTILE_SECRET?: string;
    };

    // Turnstile verification
    const turnstileSecret = cfEnv.TURNSTILE_SECRET;

    if (turnstileSecret) {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: data.token }),
      });
      const result = await res.json<{ success: boolean; "error-codes"?: string[] }>();
      if (!result.success) throw new Error(`Turnstile failed: ${result["error-codes"]?.join(", ")}`);
    }

    // Rate limiting
    const ip = getRequestIP() ?? "unknown";
    const rl = cfEnv.FEEDBACK_RL;
    if (rl) {
      const { success } = await rl.limit({ key: ip });
      if (!success) throw new Error("Too many requests");
    }

    const message = String(data.message ?? "").trim().slice(0, 2000);
    if (!message) throw new Error("Empty feedback");

    const kv = cfEnv.FEEDBACK_KV;
    if (!kv) throw new Error("FEEDBACK_KV binding is not configured");

    const id = nanoid(10);
    await kv.put(
      id,
      JSON.stringify({ message, createdAt: new Date().toISOString() }),
      { expirationTtl: 60 * 60 * 24 * 365 },
    );

    return { ok: true };
  });
