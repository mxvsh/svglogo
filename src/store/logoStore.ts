import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GradientStop = { color: string; position: number };

export type Background =
	| { type: "solid"; color: string }
	| {
			type: "gradient";
			direction: number;
			stops: [GradientStop, GradientStop];
	  };

export interface LogoState {
	iconName: string;
	iconColor: string;
	iconSize: number; // 10–90, percent of canvas
	background: Background;
	borderRadius: number; // 0–256 px
	borderWidth: number; // 0–24 px
	borderColor: string;
}

interface StoreState {
	present: LogoState;
	past: LogoState[];
	future: LogoState[];
	iconPickerOpen: boolean;

	set: (updater: (draft: LogoState) => void) => void;
	undo: () => void;
	redo: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;
	openIconPicker: () => void;
	closeIconPicker: () => void;
}

// Module-level debounce state (outside Zustand so it doesn't trigger renders)
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let snapshotBeforeGesture: LogoState | null = null;

function flushDebounce(
	get_set: (fn: (s: StoreState) => Partial<StoreState>) => void,
) {
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = null;
	}
	if (snapshotBeforeGesture !== null) {
		const snapshot = snapshotBeforeGesture;
		snapshotBeforeGesture = null;
		get_set((s) => ({ past: [...s.past.slice(-49), snapshot] }));
	}
}

const DEFAULT: LogoState = {
	iconName: "lucide:heart",
	iconColor: "#BDBDBD",
	iconSize: 60,
	background: {
		type: "solid",
		color: "#E82C4E",
	},
	borderRadius: 112,
	borderWidth: 0,
	borderColor: "#ffffff",
};

export const useLogoStore = create<StoreState>()(
	persist(
		(get_set, get) => ({
			present: DEFAULT,
			past: [],
			future: [],
			iconPickerOpen: false,

			set: (updater) => {
				const current = get().present;
				const next = produce(current, updater);
				if (next === current) return;

				// Capture snapshot at the start of a gesture (before any change in this group)
				if (snapshotBeforeGesture === null) {
					snapshotBeforeGesture = current;
				}

				// Apply change immediately (no past push yet) and clear future
				get_set(() => ({ present: next, future: [] }));

				// Commit snapshot to past after 500 ms of inactivity
				if (debounceTimer) clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
					debounceTimer = null;
					const snapshot = snapshotBeforeGesture;
					snapshotBeforeGesture = null;
					if (snapshot !== null) {
						get_set((s) => ({ past: [...s.past.slice(-49), snapshot] }));
					}
				}, 500);
			},

			undo: () => {
				// Flush any pending debounce so the gesture is committed before undoing
				flushDebounce(get_set);
				const { past, present } = get();
				if (past.length === 0) return;
				const prev = past[past.length - 1];
				get_set((s) => ({
					past: s.past.slice(0, -1),
					present: prev,
					future: [present, ...s.future.slice(0, 49)],
				}));
			},

			redo: () => {
				flushDebounce(get_set);
				const { future, present } = get();
				if (future.length === 0) return;
				const next = future[0];
				get_set((s) => ({
					past: [...s.past.slice(-49), present],
					present: next,
					future: s.future.slice(1),
				}));
			},

			canUndo: () => get().past.length > 0 || snapshotBeforeGesture !== null,
			canRedo: () => get().future.length > 0,

			openIconPicker: () => get_set({ iconPickerOpen: true }),
			closeIconPicker: () => get_set({ iconPickerOpen: false }),
		}),
		{
			name: "svglogo-state",
			partialize: (s) => ({ present: s.present }),
		},
	),
);
