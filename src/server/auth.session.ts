import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getSupabaseServerClient } from "#/lib/supabase";
import { getDb } from "#/lib/db";
import { profiles } from "../../drizzle/schema";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  onboardingCompleted: boolean;
}

export const getSessionFn = createServerFn({ method: "GET" }).handler(async (): Promise<{ user: SessionUser } | null> => {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = getDb();
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id));

  return {
    user: {
      id: user.id,
      email: user.email!,
      name: profile?.fullName ?? (user.user_metadata.full_name as string | undefined) ?? (user.user_metadata.name as string | undefined) ?? null,
      image: profile?.avatarUrl ?? (user.user_metadata.avatar_url as string | undefined) ?? null,
      onboardingCompleted: profile?.onboardingCompleted ?? false,
    },
  };
});
