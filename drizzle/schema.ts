import { pgTable, pgPolicy, text, timestamp, boolean, uuid, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const USER_ROLES = ["designer", "developer", "founder", "marketer", "student", "other"] as const;
export type UserRole = typeof USER_ROLES[number];

// profiles.id == auth.users.id (Supabase manages the auth.users table)
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    fullName: text("full_name"),
    role: text("role").$type<UserRole>(),
    avatarUrl: text("avatar_url"),
    onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    pgPolicy("profiles_select_own", {
      for: "select",
      to: "authenticated",
      using: sql`auth.uid() = ${t.id}`,
    }),
    pgPolicy("profiles_insert_own", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`auth.uid() = ${t.id}`,
    }),
    pgPolicy("profiles_update_own", {
      for: "update",
      to: "authenticated",
      using: sql`auth.uid() = ${t.id}`,
    }),
  ],
);

export const collections = pgTable(
  "collections",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id").notNull(),
    logoState: text("logo_state").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("collections_user_id_idx").on(t.userId, t.createdAt),
    pgPolicy("collections_select_own", {
      for: "select",
      to: "authenticated",
      using: sql`auth.uid() = ${t.userId}`,
    }),
    pgPolicy("collections_insert_own", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`auth.uid() = ${t.userId}`,
    }),
    pgPolicy("collections_delete_own", {
      for: "delete",
      to: "authenticated",
      using: sql`auth.uid() = ${t.userId}`,
    }),
  ],
);
