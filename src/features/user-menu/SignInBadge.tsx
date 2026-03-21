import { Lock } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { LOCKED_FREE_COUNT } from "#/data/features";
import { AuthModal } from "#/features/auth/AuthModal";

export function SignInBadge() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setModalOpen(true)}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-1.5 rounded-full border border-border bg-surface/80 backdrop-blur px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        <Lock className="size-3 text-muted/60" />
        {LOCKED_FREE_COUNT} features locked — sign up free
      </motion.button>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
