import JSZip from "jszip";
import {
  EXPORT_PLATFORMS,
  IOS_CONTENTS_JSON,
  MACOS_CONTENTS_JSON,
} from "#/data/export-platforms";
import { renderToCanvas } from "#/infra/canvas/canvas-renderer";
import { download } from "#/infra/download/file-download";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob"));
    }, "image/png");
  });
}

export async function exportAppIcons(options: {
  platforms: string[];
  squareCorners: boolean;
  includeContentsJson: boolean;
}) {
  const state = useLogoStore.getState().present;
  const exportState = options.squareCorners ? { ...state, borderRadius: 0 } : state;

  // Collect unique sizes needed across selected platforms
  const selectedPlatforms = EXPORT_PLATFORMS.filter((p) =>
    options.platforms.includes(p.id),
  );
  const uniqueSizes = [
    ...new Set(selectedPlatforms.flatMap((p) => p.sizes.map((s) => s.size))),
  ];

  // Render all unique sizes in parallel
  const rendered = new Map<number, Blob>();
  await Promise.all(
    uniqueSizes.map(async (size) => {
      const canvas = await renderToCanvas(exportState, size);
      const blob = await canvasToBlob(canvas);
      rendered.set(size, blob);
    }),
  );

  // Build zip
  const zip = new JSZip();

  for (const platform of selectedPlatforms) {
    for (const { size, filename } of platform.sizes) {
      const blob = rendered.get(size);
      if (blob) {
        zip.file(`${platform.folder}/${filename}`, blob);
      }
    }

    if (options.includeContentsJson) {
      if (platform.id === "ios") {
        zip.file(`${platform.folder}/Contents.json`, IOS_CONTENTS_JSON);
      } else if (platform.id === "macos") {
        zip.file(`${platform.folder}/Contents.json`, MACOS_CONTENTS_JSON);
      }
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, "app-icons.zip");

  trackEvent("export app icons", {
    platforms: options.platforms.join(","),
    square_corners: options.squareCorners,
    contents_json: options.includeContentsJson,
  });
}
