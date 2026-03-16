"use client";

import { LogoGithub } from "@gravity-ui/icons";
import { Button, Modal, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FEEDBACK_URL = "https://x.com/monawwarx";
const DISCORD_URL = "https://discord.gg/qjxWBqtYZu";

function FABs() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { action: "Undo", shortcut: "⌘ + Z" },
    { action: "Redo", shortcut: "⌘ + ⇧ + Z" },
    { action: "Randomize", shortcut: "R" },
    { action: "Open Icon Picker", shortcut: "I" },
    { action: "Like / Add to Collection", shortcut: "L" },
    { action: "Copy image (PNG)", shortcut: "⌘ + C" },
    { action: "Copy icon data", shortcut: "⇧ + C" },
    { action: "Paste icon data", shortcut: "⇧ + V" },
  ];

  const open = () => setIsOpen(true);
  const dismiss = () => setIsOpen(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pointer-events-auto absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2"
    >
      <motion.div variants={itemVariants}>
        <motion.div variants={itemVariants}>
          <Tooltip delay={300}> 
            <Tooltip.Trigger>
              <Link href="https://webbin.dev?ref=svglogo.dev" target="_blank" rel="noreferrer">
                <Image src="https://storage.webbin.dev/images/webbin.png" alt="Webbin" width={40} height={40} className="mb-4 rounded-xl dark:border border-2" />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content placement="left">
              <p>Discover the best AI web designs.</p>
            </Tooltip.Content>
          </Tooltip>
        </motion.div>

        <Tooltip delay={0}>
          <Link href={FEEDBACK_URL} target="_blank" rel="noreferrer">
            <Button variant="ghost" isIconOnly>
              <Icon icon="simple-icons:x" width={12} height={12} />
            </Button>
          </Link>
          <Tooltip.Content placement="left">
            <p>Follow on X</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Link href={DISCORD_URL} target="_blank" rel="noreferrer">
            <Button variant="ghost" isIconOnly>
              <Icon icon="simple-icons:discord" width={12} height={12} />
            </Button>
          </Link>
          <Tooltip.Content placement="left">
            <p>Share your feedback</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Link
            href="https://github.com/mxvsh/svglogo"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" isIconOnly>
              <LogoGithub />
            </Button>
          </Link>
          <Tooltip.Content placement="left">
            <p>Star on GitHub</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Button
            aria-label="Show info"
            onClick={open}
            isIconOnly
            variant="ghost"
          >
            <Icon icon="lucide:info" width={28} height={28} />
          </Button>
          <Tooltip.Content placement="left">
            <p>About</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) dismiss();
        }}
      >
        <Modal.Backdrop isDismissable>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>SVGLogo</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                <p>
                  Generate clean icon-based logos instantly in your browser.
                  Export as SVG, PNG, or ICO.
                </p>

                <h1 className="mt-4 mb-2 font-semibold">Keyboard Shortcuts</h1>
                <div className="flex flex-col gap-2 mt-2">
                  {shortcuts.map((s) => (
                    <div
                      key={s.action}
                      className="flex justify-between items-center text-sm text-muted"
                    >
                      <span>{s.action}</span>
                      <span className=" text-sm">{s.shortcut}</span>
                    </div>
                  ))}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={dismiss}>Close</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </motion.div>
  );
}

export default FABs;
