import { createFileRoute, redirect } from "@tanstack/react-router";
import { exchangeCodeFn } from "#/server/auth.callback";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (search.code) {
      await exchangeCodeFn({ data: { code: search.code } });
    }

    throw redirect({ to: "/editor" });
  },
});
