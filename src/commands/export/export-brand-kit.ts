import JSZip from "jszip";
import { SOCIAL_ASSETS } from "#/data/social-assets";
import { buildCanvasSvg, renderToCanvas } from "#/infra/canvas/canvas-renderer";
import { buildSocialSvg } from "#/domain/logo/logo.social-builder";
import { download } from "#/infra/download/file-download";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";
import type { BrandKitStyle, BrandKitLayout, SocialTextOptions } from "#/domain/brand-kit/brand-kit.types";
import { resolveBackground, resolveTextColor } from "#/domain/brand-kit/brand-kit.styles";
import { getFontByFamily } from "#/domain/logo/logo.fonts";

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob"));
    }, "image/png");
  });
}

function svgToPng(svgString: string, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error("No 2D context")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to create blob"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = url;
  });
}

export interface BrandKitOptions {
  socialAssets: string[];
  includeSvg: boolean;
  includePng: boolean;
  includeLogo: boolean;
  title?: string;
  tagline?: string;
  style?: BrandKitStyle;
  layout?: BrandKitLayout;
}


export async function exportBrandKit(options: BrandKitOptions) {
  const state = useLogoStore.getState().present;
  const zip = new JSZip();

  // Logo files
  if (options.includeLogo) {
    const logoSvg = await buildCanvasSvg(state, 512);
    zip.file("logo/logo.svg", logoSvg);

    const canvas512 = await renderToCanvas(state, 512);
    zip.file("logo/logo-512.png", await canvasToBlob(canvas512));

    const canvas1024 = await renderToCanvas(state, 1024);
    zip.file("logo/logo-1024.png", await canvasToBlob(canvas1024));
  }

  // Social assets
  const selectedAssets = SOCIAL_ASSETS.filter((a) => options.socialAssets.includes(a.id));

  if (selectedAssets.length > 0) {
    const logoSvg = await buildCanvasSvg(state, 512);
    const style = options.style ?? "minimal";
    const layout = options.layout ?? "centered";
    const bg = resolveBackground(style, state.background);
    const textColor = resolveTextColor(style, bg);
    const font = getFontByFamily(state.fontFamily);

    const textOpts: SocialTextOptions | undefined =
      options.title || options.tagline
        ? {
            title: options.title,
            tagline: options.tagline,
            fontFamily: state.fontFamily,
            fontWeight: font?.weight ?? 700,
            textColor,
            layout,
          }
        : undefined;

    await Promise.all(
      selectedAssets.map(async (asset) => {
        const socialSvg = buildSocialSvg(logoSvg, bg, asset.width, asset.height, textOpts);

        if (options.includeSvg) {
          zip.file(`${asset.folder}/${asset.filename}.svg`, socialSvg);
        }
        if (options.includePng) {
          const png = await svgToPng(socialSvg, asset.width, asset.height);
          zip.file(`${asset.folder}/${asset.filename}.png`, png);
        }
      }),
    );
  }

  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, "brand-kit.zip");

  trackEvent("export brand kit", {
    social_assets: options.socialAssets.join(","),
    include_svg: options.includeSvg,
    include_png: options.includePng,
    include_logo: options.includeLogo,
  });
}
