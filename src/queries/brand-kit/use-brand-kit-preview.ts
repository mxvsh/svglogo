import { useEffect, useMemo, useRef, useState } from "react";
import { buildCanvasSvg } from "#/infra/canvas/canvas-renderer";
import { buildSocialSvg } from "#/domain/logo/logo.social-builder";
import { getFontByFamily } from "#/domain/logo/logo.fonts";
import { resolveBackground, resolveTextColor } from "#/domain/brand-kit/brand-kit.styles";
import { useLogoStore } from "#/store/logo-store";
import type { BrandKitStyle, BrandKitLayout } from "#/domain/brand-kit/brand-kit.types";
import type { SocialAsset } from "#/data/social-assets";

interface PreviewOptions {
  asset: SocialAsset;
  title: string;
  tagline: string;
  style: BrandKitStyle;
  layout: BrandKitLayout;
  enabled: boolean;
}

export function useBrandKitPreview({ asset, title, tagline, style, layout, enabled }: PreviewOptions): string {
  const present = useLogoStore((s) => s.present);
  const [logoSvg, setLogoSvg] = useState("");
  const presentRef = useRef(present);
  presentRef.current = present;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    buildCanvasSvg(presentRef.current, 512).then((svg) => {
      if (!cancelled) setLogoSvg(svg);
    });
    return () => { cancelled = true; };
  }, [enabled, present.iconName, present.iconColor, present.iconBorderColor, present.iconBorderWidth, present.textMode, present.logoText, present.fontFamily]);

  return useMemo(() => {
    if (!logoSvg || !enabled) return "";
    const bg = resolveBackground(style, present.background);
    const textColor = resolveTextColor(style, bg);
    const font = getFontByFamily(present.fontFamily);
    return buildSocialSvg(logoSvg, bg, asset.width, asset.height,
      title || tagline
        ? { title: title || undefined, tagline: tagline || undefined, fontFamily: present.fontFamily, fontWeight: font?.weight ?? 700, textColor, layout }
        : undefined,
    );
  }, [logoSvg, enabled, style, layout, title, tagline, present, asset]);
}
