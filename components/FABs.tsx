"use client";

import { LogoGithub } from "@gravity-ui/icons";
import { Button, Modal, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
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
    { action: "Copy SVG JSON", shortcut: "⇧ + C" },
    { action: "Paste SVG JSON", shortcut: "⇧ + V" },
  ];

  const open = () => setIsOpen(true);
  const dismiss = () => setIsOpen(false);

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
