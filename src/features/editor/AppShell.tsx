import { type Variants, AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { LogoState } from "#/domain/logo/logo.types";
import type { AuthUser } from "#/store/auth-store";
import { loadLogoFromState } from "#/commands/logo/load-logo";
import { AuthStoreProvider } from "#/providers/AuthStoreProvider";
import { useInfiniteStore } from "#/store/infinite-store";
import { CollectionsButton } from "#/features/collections/CollectionsButton";
import { PreviewButton } from "#/features/preview/PreviewButton";
import { ShareButton } from "#/features/share/ShareButton";
import { EditorPage } from "./EditorPage";
import { FABs } from "./FABs";
import { MobileTopBar } from "./MobileTopBar";
import { WelcomeOnboarding } from "#/features/onboarding/WelcomeOnboarding";
import { OnboardingTour } from "./OnboardingTour";

export function AppShell({
  sharedLogo,
  user,
}: {
  sharedLogo?: LogoState | null;
  user?: AuthUser | null;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (sharedLogo && !initialized.current) {
      loadLogoFromState(sharedLogo);
      initialized.current = true;
    }
  }, [sharedLogo]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const infiniteMode = useInfiniteStore((s) => s.enabled);

  return (
    <AuthStoreProvider user={user ?? null}>
      <div className="block">
        <AnimatePresence>
          {!infiniteMode && (
            <motion.div
              key="chrome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MobileTopBar />

              <div className="hidden md:block">
                <FABs />
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute bottom-4 right-4 z-50 flex flex-col gap-2 items-end"
                >
                  <motion.div variants={itemVariants}>
                    <ShareButton />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <PreviewButton />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <CollectionsButton />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <OnboardingTour />
        <WelcomeOnboarding />
        <EditorPage />
      </div>
    </AuthStoreProvider>
  );
}
