import { buildCanvasSvg } from "#/infra/canvas/canvas-renderer";
import { writeText } from "#/infra/clipboard/clipboard";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export async function copySvg(): Promise<boolean> {
  try {
    const state = useLogoStore.getState().present;
    const svgString = await buildCanvasSvg(state);
    await writeText(svgString);
    trackEvent("copy svg", { icon: state.iconName });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
