import { getSupabaseServerClient, getSupabaseServiceClient } from "#/lib/supabase";
import { createServerFn } from "@tanstack/react-start";

export const signUpEarlyAccessFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user?.email) return;

    const service = getSupabaseServiceClient();
    const { error } = await service
      .from("early_access")
      .upsert({ email: data.user.email.toLowerCase().trim() }, { onConflict: "email" });

    if (error) {
      console.error("early_access upsert failed:", error);
      throw new Error(error.message);
    }
  },
);
