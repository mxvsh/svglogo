import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useVersionCheck } from "#/hooks/use-version-check";
import { WebbinPromoModal } from "./WebbinPromoModal";

export function AnnouncementBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const updateAvailable = useVersionCheck();

  if (updateAvailable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30 hidden md:block"
      >
        <button
          type="button"
          onClick={() => window.location.reload()}
          data-umami-event="update banner refresh"
          className="cursor-pointer rounded-lg bg-warning/10 border border-warning/20 px-4 py-2 text-xs font-medium text-warning backdrop-blur-sm hover:bg-warning/15 transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:refresh-cw" width={12} />
          New version available — click to refresh
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30 hidden md:block"
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          data-umami-event="announcement banner click"
          data-umami-event-id="webbin-promo"
          className="cursor-pointer rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-medium text-primary backdrop-blur-sm hover:bg-primary/15 transition-colors flex items-center gap-1.5"
        >
          <Icon icon="lucide:sparkles" width={12} />
          Introducing Webbin ✦
        </button>
      </motion.div>

      <WebbinPromoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
