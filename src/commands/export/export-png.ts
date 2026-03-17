import { renderToCanvas } from "#/infra/canvas/canvas-renderer";
import { download } from "#/infra/download/file-download";
import { trackDownload } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export async function exportPng() {
  const state = useLogoStore.getState().present;
  const canvas = await renderToCanvas(state, 512);
  canvas.toBlob((blob) => {
    if (blob) {
      download(blob, "logo.png");
      trackDownload({ format: "png", icon: state.iconName, color: state.iconColor, border: state.iconBorderWidth, background: state.background.type });
    }
  }, "image/png");
}
