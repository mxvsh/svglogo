import { Button, Modal, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { areLogosEqual } from "#/domain/logo/logo.validators";
import { copyPng } from "#/commands/export/copy-png";
import { pasteLogo } from "#/commands/logo/paste-logo";
import { saveToCollection } from "#/commands/collection/save-to-collection";
import { removeFromCollection } from "#/commands/collection/remove-from-collection";
import { useCollections } from "#/queries/collection/use-collections";
import { useLogoState, useLogoActions } from "#/queries/logo/use-logo-state";
import { useLogoStore } from "#/store/logo-store";
import { useVersionCheck } from "#/hooks/use-version-check";
import { useKbShortcut } from "#/hooks/use-kb-shortcut";
import { AnimatePresence } from "framer-motion";
import { GridBackground } from "./GridBackground";
import { LogoCanvas } from "./LogoCanvas";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { Dock } from "#/features/dock/Dock";
import { TextModeToggle } from "#/features/dock/TextModeToggle";
import { IconPickerModal } from "#/features/icon-picker/IconPickerModal";
import { useInfiniteStore } from "#/store/infinite-store";

export function EditorPage() {
  const infiniteMode = useInfiniteStore((s) => s.enabled);
  const openIconPicker = useLogoStore((s) => s.openIconPicker);
  const { undo, redo, canUndo, canRedo } = useLogoActions();
  const present = useLogoState();
  const collections = useCollections();

  useKbShortcut("i", openIconPicker);
  useKbShortcut("l", () => {
    const matchedLogo = collections.find((c) => areLogosEqual(c, present));
    if (matchedLogo) {
      void removeFromCollection(matchedLogo.id);
      toast("Removed from collection");
    } else {
      void saveToCollection();
      toast("Added to collection");
    }
  });
  useKbShortcut(
    "z",
    () => {
      if (canUndo()) undo();
    },
    { mod: "cmd" },
  );
  useKbShortcut(
    "z",
    () => {
      if (canRedo()) redo();
    },
    { mod: ["cmd", "shift"] },
  );
  useKbShortcut(
    "y",
    () => {
      if (canRedo()) redo();
    },
    { mod: "ctrl" },
  );
  useKbShortcut(
    "c",
    () => {
      const active = document.activeElement;
      const inInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active as HTMLElement)?.isContentEditable;
      const hasSelection = (window.getSelection()?.toString().length ?? 0) > 0;
      if (inInput || hasSelection) return;
      copyPng().then((ok) => toast(ok ? "PNG copied" : "Copy failed"));
    },
    { mod: "cmd", preventDefault: false },
  );

  const copyIconData = useCallback(async () => {
    const payload = JSON.stringify(present, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      toast("Icon data copied");
    } catch {
      toast("Copy failed");
    }
  }, [present]);
  useKbShortcut(
    "c",
    () => {
      void copyIconData();
    },
    { mod: "shift" },
  );

  const pasteIconData = useCallback(async () => {
    const result = await pasteLogo();
    toast(result.ok ? "Icon data pasted" : result.reason);
  }, []);
  useKbShortcut(
    "v",
    () => {
      void pasteIconData();
    },
    { mod: "shift" },
  );

  return (
    <div className="relative flex h-dvh w-screen items-center justify-center overflow-hidden">
      {import.meta.env.PROD && (
        <iframe
        src="https://cloud.livedot.dev/embed/live?website=29013677-b291-48ad-b122-26833ff63ede&token=16cc12bcecb242958d2bb278&scale=0.85&branding=1"
          className="fixed top-4 left-4 z-100 hidden md:block"
        ></iframe>
      )}

      <GridBackground />
      <TopBanner />
      <AnimatePresence mode="wait">
        {infiniteMode ? (
          <InfiniteCanvas key="infinite" />
        ) : (
          <motion.div
            key="single"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoCanvas />
          </motion.div>
        )}
      </AnimatePresence>
      <TextModeToggle />
      {!infiniteMode && <Dock />}
      <IconPickerModal />
    </div>
  );
}

function TopBanner() {
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
          data-umami-event="free banner click"
          className="cursor-pointer rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-medium text-primary backdrop-blur-sm hover:bg-primary/15 transition-colors"
        >
          100% free &amp; open source
        </button>
      </motion.div>

      <Modal isOpen={modalOpen} onOpenChange={(open) => !open && setModalOpen(false)}>
        <Modal.Backdrop isDismissable>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Body className="text-center py-8 px-6">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon icon="lucide:heart" width={28} height={28} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">We made it 100% free</h3>
                <p className="text-sm text-muted mb-4">
                  We believe great design tools should be accessible to everyone. Every feature is now free — no limits, no paywalls, no sign-up required. Enjoy!
                </p>
                <p className="text-sm text-muted mb-5">
                  SVGLogo is also open source. Check out the code, contribute, or fork it.
                </p>
                <a href="https://github.com/mxvsh/svglogo" target="_blank" rel="noreferrer">
                  <Button variant="secondary" className="gap-2">
                    <Icon icon="simple-icons:github" width={14} />
                    View on GitHub
                  </Button>
                </a>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
