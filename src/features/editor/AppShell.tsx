import { type Variants, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Tooltip } from "@heroui/react";
import type { LogoState } from "#/domain/logo/logo.types";
import { loadLogoFromState } from "#/commands/logo/load-logo";
import { CollectionsButton } from "#/features/collections/CollectionsButton";
import { ShareButton } from "#/features/share/ShareButton";
import { EditorPage } from "./EditorPage";
import { FABs } from "./FABs";
import { FeedbackButton } from "./FeedbackButton";
import { MobileTopBar } from "./MobileTopBar";
import { OnboardingTour } from "./OnboardingTour";

export function AppShell({
  sharedLogo,
}: {
  sharedLogo?: LogoState | null;
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

  return (
    <div className="block">
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
            <Tooltip delay={300}>
              <Tooltip.Trigger>
                <a
                  href="https://webbin.dev?ref=svglogo.dev"
                  target="_blank"
                  rel="noreferrer"
                  data-umami-event="click webbin"
                >
                  <img
                    src="https://storage.webbin.dev/images/webbin.png"
                    alt="Webbin"
                    width={40}
                    height={40}
                    className="rounded-xl border-2 dark:border"
                  />
                </a>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Discover the best AI web designs.</p>
              </Tooltip.Content>
            </Tooltip>
          </motion.div>
          <motion.div variants={itemVariants}>
            <ShareButton />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeedbackButton />
          </motion.div>
          <motion.div variants={itemVariants}>
            <CollectionsButton />
          </motion.div>
          <motion.div variants={itemVariants}>
            <a
              href="https://www.producthunt.com/products/svglogo?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-svglogo"
              target="_blank"
              rel="noopener noreferrer"
              className="ph-glow inline-block"
              data-umami-event="click producthunt"
              data-umami-event-source="editor"
            >
              <img alt="SVGLogo - Generate clean, export-ready logos from icons in seconds. | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1101768&amp;theme=dark&amp;t=1773894483224" />
            </a>
          </motion.div>
        </motion.div>
      </div>
      <OnboardingTour />
      <EditorPage />
    </div>
  );
}
