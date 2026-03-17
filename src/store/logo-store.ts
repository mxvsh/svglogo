import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOGO, type LogoState } from "#/domain/logo/logo.types";
import { sanitizeLogoState } from "#/domain/logo/logo.validators";

export interface LogoStoreState {
  present: LogoState;
  past: LogoState[];
  future: LogoState[];
  iconPickerOpen: boolean;
  selectedIconPrefix: string;

  set: (updater: (draft: LogoState) => void) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  openIconPicker: () => void;
  closeIconPicker: () => void;
  setSelectedIconPrefix: (prefix: string) => void;
}

// Module-level debounce state (outside Zustand so it doesn't trigger renders)
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let snapshotBeforeGesture: LogoState | null = null;

function flushDebounce(
  setState: (fn: (s: LogoStoreState) => Partial<LogoStoreState>) => void,
) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (snapshotBeforeGesture !== null) {
    const snapshot = snapshotBeforeGesture;
    snapshotBeforeGesture = null;
    setState((s) => ({ past: [...s.past.slice(-49), snapshot] }));
  }
}

export const useLogoStore = create<LogoStoreState>()(
  persist(
    (setState, get) => ({
      present: DEFAULT_LOGO,
      past: [],
      future: [],
      iconPickerOpen: false,
      selectedIconPrefix: "lucide",

      set: (updater) => {
        const current = get().present;
        const next = produce(current, updater);
        if (next === current) return;

        if (snapshotBeforeGesture === null) {
          snapshotBeforeGesture = current;
        }

        setState(() => ({ present: next, future: [] }));

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          debounceTimer = null;
          const snapshot = snapshotBeforeGesture;
          snapshotBeforeGesture = null;
          if (snapshot !== null) {
            setState((s) => ({ past: [...s.past.slice(-49), snapshot] }));
          }
        }, 500);
      },

      undo: () => {
        flushDebounce(setState);
        const { past, present } = get();
        if (past.length === 0) return;
        const prev = past[past.length - 1];
        setState((s) => ({
          past: s.past.slice(0, -1),
          present: prev,
          future: [present, ...s.future.slice(0, 49)],
        }));
      },

      redo: () => {
        flushDebounce(setState);
        const { future, present } = get();
        if (future.length === 0) return;
        const next = future[0];
        setState((s) => ({
          past: [...s.past.slice(-49), present],
          present: next,
          future: s.future.slice(1),
        }));
      },

      canUndo: () => get().past.length > 0 || snapshotBeforeGesture !== null,
      canRedo: () => get().future.length > 0,

      openIconPicker: () => setState({ iconPickerOpen: true }),
      closeIconPicker: () => setState({ iconPickerOpen: false }),
      setSelectedIconPrefix: (prefix) =>
        setState({ selectedIconPrefix: prefix || "lucide" }),
    }),
    {
      name: "svglogo-state",
      partialize: (s) => ({
        present: s.present,
        selectedIconPrefix: s.selectedIconPrefix,
      }),
      merge: (persisted, current) => {
        const data = persisted as Partial<LogoStoreState>;
        const persistedPresent = sanitizeLogoState(data.present);
        const selectedIconPrefix =
          typeof data.selectedIconPrefix === "string" &&
          data.selectedIconPrefix.length > 0
            ? data.selectedIconPrefix
            : "lucide";
        return {
          ...current,
          ...data,
          selectedIconPrefix,
          present: {
            ...persistedPresent,
          },
        };
      },
    },
  ),
);
