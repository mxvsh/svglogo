import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { loginFn } from "#/server/auth";
import { setUser } from "#/commands/auth/set-user";

export function SignInTab({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const email = data.email as string;
    const password = data.password as string;

    const result = await loginFn({ data: { email, password } });

    if (result?.error) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setUser({ email, fullName: null, onboardingCompleted: false, earlyAccess: null, plan: "free" });
    setLoading(false);
    onClose();
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
      <TextField isRequired name="password" type="password">
        <Label>Password</Label>
        <Input
          placeholder="Your password"
          variant="secondary"
          className="focus:ring-inset"
        />
        <FieldError />
      </TextField>
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button type="submit" variant="primary" isPending={loading} className="w-full" data-umami-event="auth sign in">
        Sign In
      </Button>
    </Form>
  );
}
