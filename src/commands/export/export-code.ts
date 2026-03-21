import { buildCanvasSvg } from "#/infra/canvas/canvas-renderer";
import { writeText } from "#/infra/clipboard/clipboard";
import { type CodeFramework, svgToCode } from "#/domain/export/svg-to-code";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export async function generateCode(framework: CodeFramework): Promise<string> {
  const state = useLogoStore.getState().present;
  const svg = await buildCanvasSvg(state);
  return svgToCode(svg, framework);
}

export async function copyCode(framework: CodeFramework): Promise<boolean> {
  try {
    const code = await generateCode(framework);
    await writeText(code);
    trackEvent("export code", { framework });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
