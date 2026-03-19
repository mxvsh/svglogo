import { Switch } from "@heroui/react";
import { motion } from "framer-motion";
import { updateLogo } from "#/commands/logo/update-logo";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export function TextModeToggle() {
  const textMode = useLogoStore((s) => s.present.textMode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:block fixed bottom-[4.5rem] left-1/2 z-50 -translate-x-1/2 md:bottom-[4.75rem]"
    >
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/90 px-2.5 py-1.5 shadow-lg backdrop-blur-xl">
        <Switch
          size='sm'
          isSelected={textMode}
          onChange={(checked) => {
            updateLogo((d) => { d.textMode = checked; });
            trackEvent("text mode toggle", { enabled: checked });
          }}
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
        <span className="text-xs text-muted select-none">Text Mode</span>
      </div>
    </motion.div>
  );
}
