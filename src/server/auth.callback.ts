import { getSupabaseServerClient } from "#/lib/supabase";
import { createServerFn } from "@tanstack/react-start";

export const exchangeCodeFn = createServerFn({ method: 'GET' })
  .inputValidator((d: { code: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(data.code);

    if (error) {
      return { error: true, message: error.message };
    }

    return { error: false };
  });
