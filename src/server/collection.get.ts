import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { auth } from "#/lib/auth";
import { collection } from "../../drizzle/schema";

export const getCollectionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return [];

  const db = drizzle(env.SVGLogo!);
  const rows = await db
    .select()
    .from(collection)
    .where(eq(collection.userId, session.user.id))
    .orderBy(collection.createdAt);

  return rows.map((r) => ({ id: r.id, savedAt: r.createdAt.getTime(), ...JSON.parse(r.logoState) }));
});
