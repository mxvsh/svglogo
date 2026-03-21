import { Briefcase, Code, GraduationCap, Pencil, Rocket } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ROLES: { id: string; label: string; icon: ReactNode }[] = [
  { id: "developer", label: "Developer", icon: <Code className="size-4" /> },
  { id: "designer", label: "Designer", icon: <Pencil className="size-4" /> },
  { id: "founder", label: "Founder", icon: <Rocket className="size-4" /> },
  { id: "marketer", label: "Marketer", icon: <Briefcase className="size-4" /> },
  { id: "student", label: "Student", icon: <GraduationCap className="size-4" /> },
];

interface RoleStepProps {
  selected: string | null;
  onSelect: (role: string) => void;
}

export function RoleStep({ selected, onSelect }: RoleStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
        About you
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        What best describes you?
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        This helps us tailor your experience.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs transition-colors ${
              selected === role.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface hover:border-foreground/20"
            }`}
          >
            {role.icon}
            {role.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
