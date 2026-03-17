import { renderToCanvas } from "#/infra/canvas/canvas-renderer";
import { writeImage } from "#/infra/clipboard/clipboard";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export async function copyPng(): Promise<boolean> {
  try {
    const state = useLogoStore.getState().present;
    const canvas = await renderToCanvas(state, 512);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) throw new Error("Failed to create blob");
    await writeImage(blob);
    trackEvent("copy png", { icon: state.iconName });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
