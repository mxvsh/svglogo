import { createServerFn } from "@tanstack/react-start";
import { eq, and } from "drizzle-orm";
import { getSupabaseServerClient } from "#/lib/supabase";
import { getDb } from "#/lib/db";
import { collections } from "../../drizzle/schema";

export const removeCollectionFn = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const db = getDb();
    await db.delete(collections).where(
      and(eq(collections.id, data.id), eq(collections.userId, user.id)),
    );
  });
