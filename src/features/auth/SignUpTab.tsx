import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { signupFn } from "#/server/auth";

export function SignUpTab() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const email = data.email as string;
    const password = data.password as string;

    const result = await signupFn({ data: { email, password } });

    if (result?.error) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setSuccess(email);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-sm font-medium">Check your email</p>
        <p className="text-xs text-muted">
          We sent a confirmation link to <strong>{success}</strong>
        </p>
      </div>
    );
  }

  return (
    <Form className="flex flex-col gap-4 py-4" onSubmit={onSubmit}>
      <TextField isRequired name="email" type="email">
        <Label>Email</Label>
        <Input
          placeholder="you@example.com"
          variant="secondary"
          className="focus:ring-inset"
        />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        name="password"
        type="password"
        minLength={6}
        validate={(v) => (v.length < 6 ? "Must be at least 6 characters" : null)}
      >
        <Label>Password</Label>
        <Input
          placeholder="Min. 6 characters"
          variant="secondary"
          className="focus:ring-inset"
        />
        <FieldError />
      </TextField>
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button type="submit" variant="primary" isPending={loading} className="w-full" data-umami-event="auth sign up">
        Create Account
      </Button>
    </Form>
  );
}
