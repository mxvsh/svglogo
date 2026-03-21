import { createFileRoute, redirect } from "@tanstack/react-router";
import { exchangeCodeFn } from "#/server/auth.callback";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
    error_description: typeof search.error_description === "string" ? search.error_description : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (search.error) {
      throw redirect({
        to: "/editor",
        search: { auth_error: search.error_description ?? search.error },
      });
    }

    if (search.code) {
      await exchangeCodeFn({ data: { code: search.code } });
    }

    throw redirect({ to: "/editor" });
  },
});
