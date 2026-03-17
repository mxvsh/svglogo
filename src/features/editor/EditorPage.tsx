import { toast } from "@heroui/react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { areLogosEqual } from "#/domain/logo/logo.validators";
import { copyPng } from "#/commands/export/copy-png";
import { pasteLogo } from "#/commands/logo/paste-logo";
import { saveToCollection } from "#/commands/collection/save-to-collection";
import { removeFromCollection } from "#/commands/collection/remove-from-collection";
import { useCollections } from "#/queries/collection/use-collections";
import { useLogoState, useLogoActions } from "#/queries/logo/use-logo-state";
import { useLogoStore } from "#/store/logo-store";
import { useKbShortcut } from "#/hooks/use-kb-shortcut";
import { GridBackground } from "./GridBackground";
import { LogoCanvas } from "./LogoCanvas";
import { Dock } from "#/features/dock/Dock";
import { IconPickerModal } from "#/features/icon-picker/IconPickerModal";

export function EditorPage() {
  const openIconPicker = useLogoStore((s) => s.openIconPicker);
  const { undo, redo, canUndo, canRedo } = useLogoActions();
  const present = useLogoState();
  const collections = useCollections();

  useKbShortcut("i", openIconPicker);
  useKbShortcut("l", () => {
    const matchedLogo = collections.find((c) => areLogosEqual(c, present));
    if (matchedLogo) {
      removeFromCollection(matchedLogo.id);
      toast("Removed from collection");
    } else {
      saveToCollection();
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
      void copyPng();
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
    <div className="relative flex h-dvh w-screen items-center justify-center overflow-hidden pb-16 md:pb-0">
      <GridBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="[zoom:0.55] md:[zoom:1]"
      >
        <LogoCanvas />
      </motion.div>
      <Dock />
      <IconPickerModal />
    </div>
  );
}
