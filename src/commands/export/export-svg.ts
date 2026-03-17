import { buildCanvasSvg } from "#/infra/canvas/canvas-renderer";
import { download } from "#/infra/download/file-download";
import { trackDownload } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export async function exportSvg() {
  const state = useLogoStore.getState().present;
  const svgString = await buildCanvasSvg(state);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  download(blob, "logo.svg");
  trackDownload({ format: "svg", icon: state.iconName, color: state.iconColor, border: state.iconBorderWidth, background: state.background.type });
}
