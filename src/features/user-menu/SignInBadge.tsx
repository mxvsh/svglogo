import { Button } from "@heroui/react";
import { Lock } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { AuthModal } from "#/features/auth/AuthModal";

export function SignInBadge() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur pl-3 pr-1.5 py-1"
      >
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Lock className="size-3 text-muted/60" />
          Sign in to unlock more features
        </span>
        <Button size="sm" variant="outline" className="rounded-full h-6 text-xs px-3" onPress={() => setModalOpen(true)}>
          Sign in
        </Button>
      </motion.div>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
