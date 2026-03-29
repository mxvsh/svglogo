import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";

export function SignInTab({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const { error: err } = await authClient.signIn.email({
      email: data.email as string,
      password: data.password as string,
    });

    if (err) {
      setError(err.message ?? "Sign in failed");
      setLoading(false);
      return;
    }

    setLoading(false);
    onClose();
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
      <Button type="submit" variant="primary" isPending={loading} className="w-full" data-umami-event="auth sign in">
        Sign In
      </Button>
    </Form>
  );
}
