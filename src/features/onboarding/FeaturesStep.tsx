import { Description, Label, ListBox } from "@heroui/react";
import { CloudCheck, Palette, Dice5 } from "@gravity-ui/icons";
import { motion } from "framer-motion";

const FEATURES = [
  {
    id: "palettes",
    label: "Curated color palettes",
    desc: "200 hand-picked palettes to constrain your colors",
    icon: <Palette className="size-4" />,
  },
  {
    id: "randomize",
    label: "Smart randomizer",
    desc: "One-click logo generation with palette support",
    icon: <Dice5 className="size-4" />,
  },
  {
    id: "sync",
    label: "Synced collections",
    desc: "Your saved logos sync across all your devices",
    icon: <CloudCheck className="size-4" />,
  },
];

export function FeaturesStep() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
        What's new for you
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        Unlocked features
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        These are now available on your free account.
      </p>

      <div className="mt-5 -mx-2">
        <ListBox aria-label="Unlocked features" selectionMode="none">
          {FEATURES.map((f) => (
            <ListBox.Item key={f.id} id={f.id} textValue={f.label} className="cursor-default">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {f.icon}
              </div>
              <div className="flex flex-col">
                <Label>{f.label}</Label>
                <Description>{f.desc}</Description>
              </div>
            </ListBox.Item>
          ))}
        </ListBox>
      </div>
    </motion.div>
  );
}
