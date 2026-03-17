import { pngToIco, renderToCanvas } from "#/infra/canvas/canvas-renderer";
import { download } from "#/infra/download/file-download";
import { trackDownload } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export async function exportIco() {
  const state = useLogoStore.getState().present;
  const canvas = await renderToCanvas(state, 48);
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const arrayBuffer = await blob.arrayBuffer();
    const icoBuffer = pngToIco(new Uint8Array(arrayBuffer));
    download(
      new Blob([icoBuffer as BlobPart], { type: "image/x-icon" }),
      "logo.ico",
    );
    trackDownload({ format: "ico", icon: state.iconName, color: state.iconColor, border: state.iconBorderWidth, background: state.background.type });
  }, "image/png");
}
