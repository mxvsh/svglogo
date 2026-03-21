import { Input, TextField, Label } from "@heroui/react";
import { motion } from "framer-motion";

interface WelcomeStepProps {
  email: string;
  name: string;
  onNameChange: (name: string) => void;
}

export function WelcomeStep({ email, name, onNameChange }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
        Welcome
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        Hey, glad you're here
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        You signed up as <strong>{email}</strong>. What should we call you?
      </p>
      <div className="mt-5">
        <TextField>
          <Label>Your name</Label>
          <Input
            placeholder="e.g. Alex"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            variant="secondary"
            className="focus:ring-inset"
          />
        </TextField>
      </div>
    </motion.div>
  );
}
