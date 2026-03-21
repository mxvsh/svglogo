import { getSupabaseServerClient } from "#/lib/supabase";
import { createServerFn } from "@tanstack/react-start";

export const updateProfileRoleFn = createServerFn({ method: "POST" })
  .inputValidator((d: { role: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) return;

    await supabase
      .from("profiles")
      .update({ role: data.role })
      .eq("id", auth.user.id);
  });
