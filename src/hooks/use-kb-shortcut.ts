import { useEffect } from "react";

type Modifier = "cmd" | "ctrl" | "shift" | "alt";

interface ShortcutOptions {
  mod?: Modifier | Modifier[];
  preventDefault?: boolean;
}

export function useKbShortcut(
  key: string,
  handler: () => void,
  options: ShortcutOptions = {},
) {
  const { mod, preventDefault = true } = options;

  useEffect(() => {
    const mods = mod ? (Array.isArray(mod) ? mod : [mod]) : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      const needCmd = mods.includes("cmd");
      const needCtrl = mods.includes("ctrl");
      const needShift = mods.includes("shift");
      const needAlt = mods.includes("alt");

      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      if (needCmd && !cmdOrCtrl) return;
      if (needCtrl && !e.ctrlKey) return;
      if (needShift !== e.shiftKey) return;
      if (needAlt !== e.altKey) return;
      if (!needCmd && !needCtrl && cmdOrCtrl) return;

      if (preventDefault) e.preventDefault();
      handler();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler, mod, preventDefault]);
}
