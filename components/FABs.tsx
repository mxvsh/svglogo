"use client";

import { LogoGithub } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";

const FEEDBACK_URL = "https://x.com/monawwarx";
const DISCORD_URL = "https://discord.gg/qjxWBqtYZu";

function FABs() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.35, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.35, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      className="pointer-events-auto absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2"
    >
      <Link href={FEEDBACK_URL} target="_blank" rel="noreferrer">
        <Button variant="ghost" size="sm">
          <Icon icon="simple-icons:x" width={12} height={12} />
          Feedback
        </Button>
      </Link>
      <Link href={DISCORD_URL} target="_blank" rel="noreferrer">
        <Button variant="ghost" size="sm">
          <Icon icon="simple-icons:discord" width={12} height={12} />
          Join Discord
        </Button>
      </Link>
      <Link
        href="https://github.com/mxvsh/svglogo"
        target="_blank"
        rel="noreferrer"
      >
        <Button size="sm">
          <LogoGithub /> Star on Github
        </Button>
      </Link>
    </motion.div>
  );
}

export default FABs;
