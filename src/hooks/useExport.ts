import { useCallback } from "react";
import { buildCanvasSvg } from "#/lib/canvasUtils";
import { useLogoStore } from "#/store/logoStore";

export function useExport() {
	const present = useLogoStore((s) => s.present);

	const exportSvg = useCallback(async () => {
		const svgString = await buildCanvasSvg(present);
		const blob = new Blob([svgString], { type: "image/svg+xml" });
		download(blob, "logo.svg");
	}, [present]);

	const exportPng = useCallback(async () => {
		const canvas = await renderToCanvas(present, 512);
		canvas.toBlob((blob) => {
			if (blob) download(blob, "logo.png");
		}, "image/png");
	}, [present]);

	const exportIco = useCallback(async () => {
		const canvas = await renderToCanvas(present, 48);
		canvas.toBlob(async (blob) => {
			if (!blob) return;
			const arrayBuffer = await blob.arrayBuffer();
			const icoBuffer = pngToIco(new Uint8Array(arrayBuffer));
			download(new Blob([icoBuffer], { type: "image/x-icon" }), "logo.ico");
		}, "image/png");
	}, [present]);

	return { exportSvg, exportPng, exportIco };
}

function download(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

async function renderToCanvas(
	state: ReturnType<typeof useLogoStore.getState>["present"],
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

// Minimal ICO encoder: single 48x48 PNG entry
function pngToIco(pngData: Uint8Array): Uint8Array {
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
	view.setUint8(6, width === 256 ? 0 : width);
	view.setUint8(7, height === 256 ? 0 : height);
	view.setUint8(8, 0); // color count (0 = no palette)
	view.setUint8(9, 0); // reserved
	view.setUint16(10, 1, true); // color planes
	view.setUint16(12, 32, true); // bits per pixel
	view.setUint32(14, pngData.length, true); // image size
	view.setUint32(18, offset, true); // offset to image data

	buf.set(pngData, offset);
	return buf;
}
