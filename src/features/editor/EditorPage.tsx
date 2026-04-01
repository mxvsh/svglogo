import { Button, toast } from "@heroui/react";
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
import { useKbShortcut } from "#/hooks/use-kb-shortcut";
import { AnimatePresence } from "framer-motion";
import { GridBackground } from "./GridBackground";
import { LogoCanvas } from "./LogoCanvas";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { Dock } from "#/features/dock/Dock";
import { TextModeToggle } from "#/features/dock/TextModeToggle";
import { IconPickerModal } from "#/features/icon-picker/IconPickerModal";
import { AnnouncementBanner } from "./AnnouncementBanner";
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
      <AnnouncementBanner />
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

