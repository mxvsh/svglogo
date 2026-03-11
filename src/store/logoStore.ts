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
	iconBorderColor: string;
	iconBorderWidth: number; // 0–24 px
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
	iconBorderColor: "#111111",
	iconBorderWidth: 0,
	iconSize: 60,
	background: {
		type: "solid",
		color: "#E82C4E",
	},
	borderRadius: 112,
	borderWidth: 0,
	borderColor: "#ffffff",
};

function clamp(n: unknown, min: number, max: number, fallback: number): number {
	if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}

function safeColor(value: unknown, fallback: string): string {
	return typeof value === "string" && value.length > 0 ? value : fallback;
}

function sanitizeBackground(value: unknown): Background {
	if (!value || typeof value !== "object") return DEFAULT.background;
	const bg = value as Record<string, unknown>;

	if (bg.type === "solid") {
		return {
			type: "solid",
			color: safeColor(
				bg.color,
				DEFAULT.background.type === "solid"
					? DEFAULT.background.color
					: "#E82C4E",
			),
		};
	}

	if (bg.type === "gradient") {
		const stopsRaw = Array.isArray(bg.stops) ? bg.stops : [];
		const s0 = (stopsRaw[0] ?? {}) as Record<string, unknown>;
		const s1 = (stopsRaw[1] ?? {}) as Record<string, unknown>;
		return {
			type: "gradient",
			direction: clamp(bg.direction, 0, 360, 135),
			stops: [
				{
					color: safeColor(s0.color, "#6366f1"),
					position: clamp(s0.position, 0, 100, 0),
				},
				{
					color: safeColor(s1.color, "#a855f7"),
					position: clamp(s1.position, 0, 100, 100),
				},
			],
		};
	}

	return DEFAULT.background;
}

function sanitizeLogoState(value: unknown): LogoState {
	if (!value || typeof value !== "object") return DEFAULT;
	const v = value as Record<string, unknown>;
	return {
		iconName:
			typeof v.iconName === "string" && v.iconName.includes(":")
				? v.iconName
				: DEFAULT.iconName,
		iconColor: safeColor(v.iconColor, DEFAULT.iconColor),
		iconBorderColor: safeColor(v.iconBorderColor, DEFAULT.iconBorderColor),
		iconBorderWidth: clamp(v.iconBorderWidth, 0, 24, DEFAULT.iconBorderWidth),
		iconSize: clamp(v.iconSize, 10, 90, DEFAULT.iconSize),
		background: sanitizeBackground(v.background),
		borderRadius: clamp(v.borderRadius, 0, 256, DEFAULT.borderRadius),
		borderWidth: clamp(v.borderWidth, 0, 24, DEFAULT.borderWidth),
		borderColor: safeColor(v.borderColor, DEFAULT.borderColor),
	};
}

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
			merge: (persisted, current) => {
				const data = persisted as Partial<StoreState>;
				const persistedPresent = sanitizeLogoState(data.present);
				return {
					...current,
					...data,
					present: {
						...persistedPresent,
					},
				};
			},
		},
	),
);
