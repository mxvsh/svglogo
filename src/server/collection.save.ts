import { createServerFn } from "@tanstack/react-start";
import { eq, count } from "drizzle-orm";
import { getSupabaseServerClient } from "#/lib/supabase";
import { getDb } from "#/lib/db";
import { collections } from "../../drizzle/schema";
import type { LogoState } from "#/domain/logo/logo.types";
import { COLLECTION_LIMIT } from "#/data/limits";

export const saveCollectionFn = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; logo: LogoState }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const db = getDb();

    const [{ total }] = await db
      .select({ total: count() })
      .from(collections)
      .where(eq(collections.userId, user.id));

    if (total >= COLLECTION_LIMIT) return { error: "limit_reached" };

    await db.insert(collections).values({
      id: data.id,
      userId: user.id,
      logoState: JSON.stringify(data.logo),
    }).onConflictDoNothing();
  });
