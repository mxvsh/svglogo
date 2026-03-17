import { useLogoStore } from "#/store/logo-store";

export function useLogoState() {
  return useLogoStore((s) => s.present);
}

export function useLogoActions() {
  const set = useLogoStore((s) => s.set);
  const undo = useLogoStore((s) => s.undo);
  const redo = useLogoStore((s) => s.redo);
  const canUndo = useLogoStore((s) => s.canUndo);
  const canRedo = useLogoStore((s) => s.canRedo);
  return { set, undo, redo, canUndo, canRedo };
}
