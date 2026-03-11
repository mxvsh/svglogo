import { useEffect } from "react";

type Modifier = "cmd" | "ctrl" | "shift" | "alt";

interface ShortcutOptions {
	mod?: Modifier | Modifier[];
	preventDefault?: boolean;
}

/**
 * useKbShortcut("Z", handler, { mod: "cmd" })
 * useKbShortcut("Z", handler, { mod: ["cmd", "shift"] })
 * useKbShortcut("I", handler)   // no modifier
 */
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

			// "cmd" matches Meta (Mac) or Ctrl (Win/Linux)
			const cmdOrCtrl = e.metaKey || e.ctrlKey;
			if (needCmd && !cmdOrCtrl) return;
			if (needCtrl && !e.ctrlKey) return;
			if (needShift !== e.shiftKey) return;
			if (needAlt !== e.altKey) return;
			// If no cmd/ctrl modifier requested, make sure neither is held
			if (!needCmd && !needCtrl && cmdOrCtrl) return;

			if (preventDefault) e.preventDefault();
			handler();
		};

		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [key, handler, mod, preventDefault]);
}
