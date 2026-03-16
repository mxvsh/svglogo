"use client";

import { toast } from "@heroui/react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { GridBackground } from "#/components/canvas/GridBackground";
import { LogoCanvas } from "#/components/canvas/LogoCanvas";
import { Dock } from "#/components/dock/Dock";
import { IconPickerModal } from "#/components/icon-picker/IconPickerModal";
import { useExport } from "#/hooks/useExport";
import { useKbShortcut } from "#/hooks/useKbShortcut";
import { trackEvent } from "#/lib/analytics";
import { useCollectionStore } from "#/store/collectionStore";
import { areLogosEqual, useLogoStore } from "#/store/logoStore";

function EditorPage() {
  const openIconPicker = useLogoStore((s) => s.openIconPicker);
  const undo = useLogoStore((s) => s.undo);
  const redo = useLogoStore((s) => s.redo);
  const canUndo = useLogoStore((s) => s.canUndo);
  const canRedo = useLogoStore((s) => s.canRedo);
  const present = useLogoStore((s) => s.present);
  const set = useLogoStore((s) => s.set);

  const collections = useCollectionStore((s) => s.collections);
  const { saveLogo, removeLogo } = useCollectionStore();
  const { copyPng } = useExport();

  useKbShortcut("i", openIconPicker);
  useKbShortcut("l", () => {
    const matchedLogo = collections.find((c) => areLogosEqual(c, present));
    if (matchedLogo) {
      removeLogo(matchedLogo.id);
      trackEvent("remove collection");
      toast("Removed from collection");
    } else {
      saveLogo(present);
      trackEvent("save collection");
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
  // Cmd+C — copy PNG (skip when text is selected or an input is focused)
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
    () => { void copyIconData(); },
    { mod: "shift" },
  );

  const pasteIconData = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (!isLogoStateLike(parsed)) {
        toast("Clipboard does not contain valid icon data");
        return;
      }
      set((d) => {
        d.iconName = parsed.iconName;
        d.iconColor = parsed.iconColor;
        d.iconSize = parsed.iconSize;
        d.background = parsed.background;
        d.borderRadius = parsed.borderRadius;
        d.borderWidth = parsed.borderWidth;
        d.borderColor = parsed.borderColor;
      });
      toast("Icon data pasted");
    } catch {
      toast("Paste failed");
    }
  }, [set]);
  useKbShortcut(
    "v",
    () => { void pasteIconData(); },
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

function isLogoStateLike(value: unknown): value is {
  iconName: string;
  iconColor: string;
  iconSize: number;
  background:
    | { type: "solid"; color: string }
    | {
        type: "gradient";
        direction: number;
        stops: [
          { color: string; position: number },
          { color: string; position: number },
        ];
      };
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
} {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (
    typeof v.iconName !== "string" ||
    typeof v.iconColor !== "string" ||
    typeof v.iconSize !== "number" ||
    typeof v.borderRadius !== "number" ||
    typeof v.borderWidth !== "number" ||
    typeof v.borderColor !== "string" ||
    !v.background ||
    typeof v.background !== "object"
  ) {
    return false;
  }

  const bg = v.background as Record<string, unknown>;
  if (bg.type === "solid") {
    return typeof bg.color === "string";
  }
  if (bg.type === "gradient") {
    if (
      typeof bg.direction !== "number" ||
      !Array.isArray(bg.stops) ||
      bg.stops.length !== 2
    ) {
      return false;
    }
    const [a, b] = bg.stops as Array<Record<string, unknown>>;
    return (
      typeof a?.color === "string" &&
      typeof a?.position === "number" &&
      typeof b?.color === "string" &&
      typeof b?.position === "number"
    );
  }
  return false;
}

export default EditorPage;
