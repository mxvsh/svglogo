import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";

export function SignUpTab({ onSuccess }: { onSuccess?: () => void }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const { error: err } = await authClient.signUp.email({
      email: data.email as string,
      password: data.password as string,
      name: "",
    });

    if (err) {
      setError(err.message ?? "Sign up failed");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    onSuccess?.();
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-sm font-medium">Account created</p>
        <p className="text-xs text-muted">Check your email to verify your account.</p>
      </div>
    );
  }

  return (
    <Form className="flex flex-col gap-4 py-4" onSubmit={onSubmit}>
      <TextField isRequired name="email" type="email">
        <Label>Email</Label>
        <Input placeholder="you@example.com" variant="secondary" className="focus:ring-inset" />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        name="password"
        type="password"
        minLength={8}
        validate={(v) => (v.length < 8 ? "Must be at least 8 characters" : null)}
      >
        <Label>Password</Label>
        <Input placeholder="Min. 8 characters" variant="secondary" className="focus:ring-inset" />
        <FieldError />
      </TextField>
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button type="submit" variant="primary" isPending={loading} className="w-full" data-umami-event="auth sign up">
        Create Account
      </Button>
    </Form>
  );
}
