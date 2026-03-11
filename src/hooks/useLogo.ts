import { useLogoStore } from "#/store/logoStore";

export function useLogo() {
	const present = useLogoStore((s) => s.present);
	const set = useLogoStore((s) => s.set);
	const undo = useLogoStore((s) => s.undo);
	const redo = useLogoStore((s) => s.redo);
	const canUndo = useLogoStore((s) => s.canUndo);
	const canRedo = useLogoStore((s) => s.canRedo);
	return { ...present, set, undo, redo, canUndo, canRedo };
}
