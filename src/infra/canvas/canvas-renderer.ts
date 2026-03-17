import type { LogoState } from "#/domain/logo/logo.types";
import { buildCanvasSvgSync } from "#/domain/logo/logo.svg-builder";
import { fetchIconSvgs } from "#/infra/iconify/iconify-client";

export async function buildCanvasSvg(
  state: LogoState,
  size = 512,
): Promise<string> {
  const cache = await fetchIconSvgs(state);
  return buildCanvasSvgSync(state, cache, size);
}

export async function renderToCanvas(
  state: LogoState,
  size: number,
): Promise<HTMLCanvasElement> {
  const svgString = await buildCanvasSvg(state, size);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("2D context is not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function pngToIco(pngData: Uint8Array): Uint8Array {
  const width = 48;
  const height = 48;
  const headerSize = 6;
  const dirEntrySize = 16;
  const offset = headerSize + dirEntrySize;

  const buf = new Uint8Array(offset + pngData.length);
  const view = new DataView(buf.buffer);

  // ICONDIR header
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: 1 = ICO
  view.setUint16(4, 1, true); // count: 1 image

  // ICONDIRENTRY
  view.setUint8(6, width);
  view.setUint8(7, height);
  view.setUint8(8, 0); // color count (0 = no palette)
  view.setUint8(9, 0); // reserved
  view.setUint16(10, 1, true); // color planes
  view.setUint16(12, 32, true); // bits per pixel
  view.setUint32(14, pngData.length, true); // image size
  view.setUint32(18, offset, true); // offset to image data

  buf.set(pngData, offset);
  return buf;
}
