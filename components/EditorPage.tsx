"use client";

import { toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { GridBackground } from "#/components/canvas/GridBackground";
import { LogoCanvas } from "#/components/canvas/LogoCanvas";
import { Dock } from "#/components/dock/Dock";
import { IconPickerModal } from "#/components/icon-picker/IconPickerModal";
import { useKbShortcut } from "#/hooks/useKbShortcut";
import { useLogoStore } from "#/store/logoStore";

const FEEDBACK_URL = "https://x.com/monawwarx";
const DISCORD_URL = "https://discord.gg/qjxWBqtYZu";

function EditorPage() {
  const openIconPicker = useLogoStore((s) => s.openIconPicker);
  const undo = useLogoStore((s) => s.undo);
  const redo = useLogoStore((s) => s.redo);
  const canUndo = useLogoStore((s) => s.canUndo);
  const canRedo = useLogoStore((s) => s.canRedo);
  const present = useLogoStore((s) => s.present);
  const set = useLogoStore((s) => s.set);

  useKbShortcut("i", openIconPicker);
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
  const copyCurrentSettings = useCallback(async () => {
    const payload = JSON.stringify(present, null, 2);

    try {
      await navigator.clipboard.writeText(payload);
      toast("Copied current settings");
    } catch {
      toast("Copy failed");
    }
  }, [present]);
  useKbShortcut(
    "c",
    () => {
      void copyCurrentSettings();
    },
    { mod: "shift" },
  );
  const applySettingsFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (!isLogoStateLike(parsed)) {
        toast("Clipboard does not contain valid settings");
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
      toast("Applied settings from clipboard");
    } catch {
      toast("Paste failed");
    }
  }, [set]);
  useKbShortcut(
    "p",
    () => {
      void applySettingsFromClipboard();
    },
    { mod: "shift" },
  );

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      <GridBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <LogoCanvas />
      </motion.div>
      <Dock />
      <IconPickerModal />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { duration: 0.35, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.35, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
        }}
        className="pointer-events-auto absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2"
      >
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1.5 text-xs text-foreground shadow-lg backdrop-blur-xl transition hover:bg-surface-secondary"
        >
          <Icon icon="simple-icons:x" width={12} height={12} />
          Feedback
        </a>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface)/90 px-3 py-1.5 text-xs text-foreground) shadow-lg backdrop-blur-xl transition hover:bg-surface-secondary)"
        >
          <Icon icon="simple-icons:discord" width={12} height={12} />
          Join Discord
        </a>
      </motion.div>
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
