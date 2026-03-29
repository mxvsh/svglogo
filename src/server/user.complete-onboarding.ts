import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import { auth } from "#/lib/auth";
import { collection, profile } from "../../drizzle/schema";
import type { UserRole } from "../../drizzle/schema";
import type { LogoState } from "#/domain/logo/logo.types";

export const completeOnboardingFn = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { name: string; role: UserRole | null; collectionsToSync: LogoState[] }) => d,
  )
  .handler(async ({ data }) => {
    const request = getRequest();
    const db = drizzle(env.SVGLogo!);

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return { error: true, message: "Not authenticated" };

    const userId = session.user.id;

    await auth.api.updateUser({
      body: { name: data.name, onboardingCompleted: true },
      headers: request.headers,
    });

    await db
      .insert(profile)
      .values({
        id: nanoid(10),
        userId,
        role: data.role ?? undefined,
        avatarUrl: session.user.image ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profile.userId,
        set: { role: data.role ?? undefined, avatarUrl: session.user.image ?? null, updatedAt: new Date() },
      });

    if (data.collectionsToSync.length > 0) {
      await db.insert(collection).values(
        data.collectionsToSync.map((logo) => ({
          id: nanoid(10),
          userId,
          logoState: JSON.stringify(logo),
          folderId: null,
          createdAt: new Date(),
        })),
      );
    }

    return { error: false };
  });
