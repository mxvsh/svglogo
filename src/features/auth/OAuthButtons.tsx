import { Button, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";

export function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleOAuth(provider: "google" | "github") {
    setLoading(provider);
    await authClient.signIn.social({
      provider,
      callbackURL: "/editor",
    });
    setLoading(null);
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted">or continue with</span>
        <Separator className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full"
          isPending={loading === "google"}
          onPress={() => handleOAuth("google")}
          data-umami-event="auth oauth google"
        >
          <Icon icon="simple-icons:google" width={16} height={16} />
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          isPending={loading === "github"}
          onPress={() => handleOAuth("github")}
          data-umami-event="auth oauth github"
        >
          <Icon icon="simple-icons:github" width={16} height={16} />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
