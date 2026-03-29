import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getSupabaseServerClient } from "#/lib/supabase";
import { getDb } from "#/lib/db";
import { collections } from "../../drizzle/schema";

export const getCollectionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  // getSession() decodes the JWT locally (no network call) — acceptable for read-only data fetching
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return [];

  const db = getDb();
  const rows = await db
    .select()
    .from(collections)
    .where(eq(collections.userId, user.id))
    .orderBy(collections.createdAt);

  return rows.map((r) => ({ id: r.id, savedAt: r.createdAt.getTime(), ...JSON.parse(r.logoState) }));
});
