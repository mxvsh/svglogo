import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { trackEvent } from "#/lib/analytics";
import { useChangelogStatus } from "#/queries/changelog/use-changelog-status";
import { getRandomizeStats } from "#/commands/logo/randomize-logo";
import { InfoModal } from "./InfoModal";
import { StatsModal } from "./StatsModal";

const X_URL = "https://x.com/monawwarx";
const GITHUB_URL = "https://github.com/mxvsh/svglogo";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export function FABs() {
  const [isOpen, setIsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<string | undefined>();
  const [highlightLatest, setHighlightLatest] = useState(false);
  const { hasNew, markSeen } = useChangelogStatus();
  const showStats = Object.values(getRandomizeStats()).some((v) => v > 50);

  function openInfo() {
    const wasNew = hasNew;
    setDefaultTab(wasNew ? "changelog" : undefined);
    setHighlightLatest(wasNew);
    if (wasNew) markSeen();
    setIsOpen(true);
    trackEvent("open info", {
      tab: wasNew ? "changelog" : "about",
      has_new: wasNew,
    });
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pointer-events-auto absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2"
    >
      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a href={X_URL} target="_blank" rel="noreferrer" data-umami-event="click x link">
              <Button variant="ghost" isIconOnly aria-label="Follow on X">
                <Icon icon="simple-icons:x" width={12} height={12} />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>Follow on X</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a href="mailto:feedback@svglogo.dev" data-umami-event="click feedback link">
              <Button variant="ghost" isIconOnly aria-label="Send feedback">
                <Icon icon="lucide:mail" width={15} height={15} />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>Send feedback</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" data-umami-event="click github link">
              <Button variant="ghost" isIconOnly aria-label="GitHub">
                <Icon icon="simple-icons:github" width={14} height={14} />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>GitHub</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <Button
              aria-label="Show info"
              onPress={openInfo}
              isIconOnly
              variant="ghost"
              className="relative"
            >
              <Icon icon="lucide:info" width={28} height={28} />
              {hasNew && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>About</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      {showStats && (
        <motion.div variants={itemVariants}>
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Button
                aria-label="Show stats"
                onPress={() => setStatsOpen(true)}
                isIconOnly
                variant="ghost"
                data-umami-event="open stats modal"
              >
                <Icon icon="lucide:bar-chart-2" width={18} height={18} />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="left">
              <p>Your stats</p>
            </Tooltip.Content>
          </Tooltip>
        </motion.div>
      )}

      <InfoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultTab={defaultTab}
        highlightLatest={highlightLatest}
      />
      <StatsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
    </motion.div>
  );
}
