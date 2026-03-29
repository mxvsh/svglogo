import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getSupabaseServerClient, getSupabaseAdminClient } from "#/lib/supabase";
import { getDb } from "#/lib/db";
import { profiles } from "../../drizzle/schema";

export const updateProfileFn = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: true, message: "Not authenticated" };

    const admin = getSupabaseAdminClient();
    const db = getDb();

    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { full_name: data.name },
    });

    await db
      .update(profiles)
      .set({ fullName: data.name, updatedAt: new Date() })
      .where(eq(profiles.id, user.id));

    return { error: false };
  });
