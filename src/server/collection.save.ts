import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq, count } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { auth } from "#/lib/auth";
import { collection } from "../../drizzle/schema";
import type { LogoState } from "#/domain/logo/logo.types";
import { COLLECTION_LIMIT } from "#/data/limits";

export const saveCollectionFn = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; logo: LogoState }) => d)
  .handler(async ({ data }) => {
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return;

    const db = drizzle(env.SVGLogo!);

    const [{ total }] = await db
      .select({ total: count() })
      .from(collection)
      .where(eq(collection.userId, session.user.id));

    if (total >= COLLECTION_LIMIT) return { error: "limit_reached" };

    await db.insert(collection).values({
      id: data.id,
      userId: session.user.id,
      logoState: JSON.stringify(data.logo),
      folderId: null,
      createdAt: new Date(),
    }).onConflictDoNothing();
  });
