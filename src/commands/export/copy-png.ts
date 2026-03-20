import { renderToCanvas } from "#/infra/canvas/canvas-renderer";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export async function copyPng(): Promise<boolean> {
  try {
    const state = useLogoStore.getState().present;
    const blobPromise = renderToCanvas(state, 512).then(
      (canvas) =>
        new Promise<Blob>((resolve, reject) =>
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
        ),
    );
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
    trackEvent("copy png", { icon: state.iconName });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
