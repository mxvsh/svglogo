import { useLogoStore } from "#/store/logo-store";

export function undo() {
  useLogoStore.getState().undo();
}

export function redo() {
  useLogoStore.getState().redo();
}

export function canUndo() {
  return useLogoStore.getState().canUndo();
}

export function canRedo() {
  return useLogoStore.getState().canRedo();
}
