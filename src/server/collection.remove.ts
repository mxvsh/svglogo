import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq, and } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { auth } from "#/lib/auth";
import { collection } from "../../drizzle/schema";

export const removeCollectionFn = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return;

    const db = drizzle(env.SVGLogo!);
    await db.delete(collection).where(
      and(eq(collection.id, data.id), eq(collection.userId, session.user.id)),
    );
  });
