import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSupabaseServerClient } from "#/lib/supabase";

const handleCallbackFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) throw redirect({ to: "/editor" });
  }

  throw redirect({ to: "/" });
});

export const Route = createFileRoute("/auth/callback")({
  beforeLoad: () => handleCallbackFn(),
});
