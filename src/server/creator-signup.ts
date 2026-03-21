import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { getSupabaseServiceClient } from "#/lib/supabase";

export const creatorSignupFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { email: string; token: string })
  .handler(async ({ data }) => {
    const { email, token } = data;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email");
    }

    const cfEnv = env;

    if (cfEnv.TELEGRAM_BOT_TOKEN && cfEnv.TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${cfEnv.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: cfEnv.TELEGRAM_CHAT_ID,
          text: `🎉 New creator plan early signup: ${email}`,
        }),
      });
    }

    if (cfEnv.TURNSTILE_SECRET) {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: cfEnv.TURNSTILE_SECRET, response: token }),
      });
      const result = await res.json<{ success: boolean; "error-codes"?: string[] }>();
      if (!result.success) throw new Error(`Turnstile failed: ${result["error-codes"]?.join(", ")}`);
    }

    const supabase = getSupabaseServiceClient();
    await supabase
      .from("early_access")
      .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

    return { ok: true };
  });
