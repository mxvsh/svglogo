import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient, getSupabaseAdminClient } from "#/lib/supabase";
import { getDb } from "#/lib/db";
import { profiles, collections } from "../../drizzle/schema";
import type { UserRole } from "../../drizzle/schema";
import type { LogoState } from "#/domain/logo/logo.types";

export const completeOnboardingFn = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { name: string; role: UserRole | null; collectionsToSync: LogoState[] }) => d,
  )
  .handler(async ({ data }) => {
    try {
      const supabase = getSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: true, message: "Not authenticated" };

      const admin = getSupabaseAdminClient();
      const db = getDb();
      const userId = user.id;

      await admin.auth.admin.updateUserById(userId, {
        user_metadata: { full_name: data.name },
      });

      await db
        .insert(profiles)
        .values({
          id: userId,
          fullName: data.name,
          role: data.role ?? undefined,
          avatarUrl: (user.user_metadata.avatar_url as string | undefined) ?? null,
          onboardingCompleted: true,
        })
        .onConflictDoUpdate({
          target: profiles.id,
          set: {
            fullName: data.name,
            role: data.role ?? undefined,
            onboardingCompleted: true,
            updatedAt: new Date(),
          },
        });

      if (data.collectionsToSync.length > 0) {
        await db.insert(collections).values(
          data.collectionsToSync.map((logo, i) => ({
            id: `${userId}-${Date.now()}-${i}`,
            userId,
            logoState: JSON.stringify(logo),
          })),
        ).onConflictDoNothing();
      }

      return { error: false };
    } catch (e) {
      console.error("[complete-onboarding]", e);
      return { error: true, message: e instanceof Error ? e.message : "Unknown error" };
    }
  });
