import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { loginFn } from "#/server/auth";
import { getTurnstileToken } from "#/lib/turnstile";

export function SignInTab({ onSignedIn }: { onSignedIn: () => Promise<void> }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!getTurnstileToken()) return;
    setError("");
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = await loginFn({
      data: { email: data.email as string, password: data.password as string },
    });

    if (result?.error) {
      setError(result.message ?? "Sign in failed");
      setLoading(false);
      return;
    }

    await onSignedIn();
    setLoading(false);
  }

  return (
    <Form className="flex flex-col gap-4 py-4" onSubmit={onSubmit}>
      <TextField isRequired name="email" type="email">
        <Label>Email</Label>
        <Input placeholder="you@example.com" variant="secondary" className="focus:ring-inset" />
        <FieldError />
      </TextField>
      <TextField isRequired name="password" type="password">
        <Label>Password</Label>
        <Input placeholder="Your password" variant="secondary" className="focus:ring-inset" />
        <FieldError />
      </TextField>
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button
        type="submit"
        variant="primary"
        isPending={loading}
        isDisabled={!getTurnstileToken()}
        className="w-full"
        data-umami-event="auth sign in"
      >
        Sign In
      </Button>
    </Form>
  );
}
