import { type Variants, AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { setTurnstileToken, clearTurnstileToken } from "#/lib/turnstile";
import type { LogoState } from "#/domain/logo/logo.types";
import { loadLogoFromState } from "#/commands/logo/load-logo";
import { useInfiniteStore } from "#/store/infinite-store";
import { CollectionsButton } from "#/features/collections/CollectionsButton";
import { Tooltip } from "@heroui/react";
import { PreviewButton } from "#/features/preview/PreviewButton";
import { ShareButton } from "#/features/share/ShareButton";
import { UserButton } from "#/features/auth/UserButton";
import { OnboardingModal } from "#/features/auth/OnboardingModal";
import { CollectionSyncModal } from "#/features/auth/CollectionSyncModal";
import { useSession } from "#/queries/auth/use-session";
import { usePostLoginSync } from "#/hooks/use-post-login-sync";
import { EditorPage } from "./EditorPage";
import { FABs } from "./FABs";
import { MobileTopBar } from "./MobileTopBar";
import { OnboardingTour } from "./OnboardingTour";
import { WebbinPromoModal } from "./WebbinPromoModal";

export function AppShell({
  sharedLogo,
}: {
  sharedLogo?: LogoState | null;
}) {
  const initialized = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
  const { data: session } = useSession();
  const showOnboarding = !!session && !session.user.onboardingCompleted;
  const { syncData, clearSyncData } = usePostLoginSync();

  return (
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
              <div className="fixed top-4 right-4 z-50">
                <UserButton />
              </div>
              <FABs />
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="absolute bottom-4 right-4 z-50 flex flex-col gap-2 items-end"
              >
                <motion.div variants={itemVariants}>
                  <Tooltip delay={0} placement="left">
                    <Tooltip.Trigger>
                      <a href="https://webbin.dev?utm_source=svglogo" target="_blank" rel="noreferrer" data-umami-event="click webbin link" className="relative block">
                        <motion.span
                          className="absolute inset-0 rounded-xl"
                          style={{ boxShadow: '0 0 0 0 rgba(139,92,246,0.7)' }}
                          animate={{ boxShadow: ['0 0 0 0px rgba(139,92,246,0.7)', '0 0 0 8px rgba(139,92,246,0)', '0 0 0 0px rgba(139,92,246,0)'] }}
                          transition={{ duration: 1.5, repeat: 1, ease: 'easeOut' }}
                        />
                        <img src="/webbin.png" alt="Webbin" width={40} height={40} className="rounded-xl relative z-10" />
                      </a>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Business profile to website</p>
                    </Tooltip.Content>
                  </Tooltip>
                </motion.div>
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
      <OnboardingModal isOpen={showOnboarding} onClose={() => {}} />
      <WebbinPromoModal />
      <CollectionSyncModal
        isOpen={!!syncData}
        cloudCount={syncData?.cloud.length ?? 0}
        localCount={syncData?.local.length ?? 0}
        cloudCollections={syncData?.cloud ?? []}
        localCollections={syncData?.local ?? []}
        onClose={clearSyncData}
      />
      <EditorPage />
      {mounted && (
        <Turnstile
          siteKey="0x4AAAAAACsp6BY1heuKsB5N"
          options={{ size: "invisible" }}
          onSuccess={setTurnstileToken}
          onExpire={clearTurnstileToken}
        />
      )}
    </div>
  );
}
