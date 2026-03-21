import { getSupabaseServerClient } from "#/lib/supabase";
import { createServerFn } from "@tanstack/react-start";

export const updateProfileNameFn = createServerFn({ method: "POST" })
  .inputValidator((d: { fullName: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) return;

    await supabase
      .from("profiles")
      .update({ full_name: data.fullName })
      .eq("id", auth.user.id);
  });
