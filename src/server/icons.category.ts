import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { getSupabaseServerClient } from "#/lib/supabase";
import { ICON_CATEGORIES } from "#/domain/icon/icon.types";
import type { IconCategoryId } from "#/domain/icon/icon.types";

export const getCategoryIconsFn = createServerFn({ method: "POST" })
  .inputValidator((d: { category: IconCategoryId }) => d)
  .handler(async ({ data }) => {
    const searchUrl = (env as Record<string, string>).SEARCH_SERVICE_URL;
    const apiKey = (env as Record<string, string>).SEARCH_SERVICE_API_KEY;

    if (!searchUrl) return { icons: [] };

    const supabase = getSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { icons: [] };

    const label = ICON_CATEGORIES.find((c) => c.id === data.category)?.label ?? data.category;

    const res = await fetch(`${searchUrl}/search`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey ?? "",
      },
      body: JSON.stringify({ query: label, userId: session.user.id }),
    });

    if (!res.ok) return { icons: [] };

    const result = (await res.json()) as { icons: string[] };
    return { icons: result.icons };
  });
