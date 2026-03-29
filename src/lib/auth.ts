import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as schema from "../../drizzle/schema";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(drizzle(env.SVGLogo!), {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      onboardingCompleted: {
        type: "boolean",
        defaultValue: false,
        returned: true,
        input: true,
      },
    },
  },
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } }
      : {}),
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? { github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET } }
      : {}),
  },
  trustedOrigins: ["https://svglogo.dev", "http://localhost:3000"],
  plugins: [tanstackStartCookies()],
});
