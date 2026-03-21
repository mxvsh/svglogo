import { getSupabaseServerClient } from "#/lib/supabase";
import { createServerFn } from "@tanstack/react-start";

export const completeOnboardingFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", data.user.id);
  },
);
