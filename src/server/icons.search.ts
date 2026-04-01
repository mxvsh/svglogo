import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { getSupabaseServerClient } from "#/lib/supabase";

export const searchIconsByCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    const searchUrl = (env as Record<string, string>).SEARCH_SERVICE_URL;
    const apiKey = (env as Record<string, string>).SEARCH_SERVICE_API_KEY;

    if (!searchUrl) return { icons: [], error: null };

    const supabase = getSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { icons: [], error: "Sign in to use AI search" };

    const res = await fetch(`${searchUrl}/search`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey ?? "",
      },
      body: JSON.stringify({ query: data.query, userId: session.user.id }),
    });

    if (res.status === 429) {
      const result = (await res.json()) as { error: string };
      return { icons: [], error: result.error };
    }

    if (!res.ok) {
      return { icons: [], error: "Search failed" };
    }

    const result = (await res.json()) as { icons: string[] };
    return { icons: result.icons, error: null };
  });
