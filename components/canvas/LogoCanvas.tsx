import { useEffect, useRef, useState } from "react";
import {
  buildBackgroundCss,
  buildCanvasSvgSync,
  fetchIconSvgs,
  type IconSvgCache,
} from "#/lib/canvasUtils";
import { useLogoStore } from "#/store/logoStore";

export function LogoCanvas() {
  const present = useLogoStore((s) => s.present);

  // Primitive selectors — used as deps to avoid Biome's "more specific than captures" lint
  const iconName = useLogoStore((s) => s.present.iconName);
  const iconColor = useLogoStore((s) => s.present.iconColor);
  const iconBorderColor = useLogoStore((s) => s.present.iconBorderColor);
  const iconBorderWidth = useLogoStore((s) => s.present.iconBorderWidth);

  const [svg, setSvg] = useState<string>("");
  const cacheRef = useRef<IconSvgCache | null>(null);
  const presentRef = useRef(present);
  presentRef.current = present;

  const bgStyle = buildBackgroundCss(present.background);

  // Fetch icon SVGs only when icon identity fields change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally limited to icon identity fields; other fields are read from presentRef to avoid refetching
  useEffect(() => {
    let cancelled = false;

    fetchIconSvgs(presentRef.current).then((cache) => {
      if (cancelled) return;
      cacheRef.current = cache;
      setSvg(buildCanvasSvgSync(presentRef.current, cache, 512));
    });

    return () => {
      cancelled = true;
    };
  }, [iconName, iconColor, iconBorderColor, iconBorderWidth]);

  // Rebuild synchronously from cache when only layout/transform props change
  useEffect(() => {
    if (!cacheRef.current) return;
    setSvg(buildCanvasSvgSync(present, cacheRef.current, 512));
  }, [present]);

  return (
    <div
      className="relative shrink-0 shadow-2xl shadow-black/50"
      data-tour="canvas"
      style={{
        width: 512,
        height: 512,
        borderRadius: present.borderRadius,
        overflow: "hidden",
        ...bgStyle,
        ...(present.borderWidth > 0
          ? {
              boxShadow: `inset 0 0 0 ${present.borderWidth}px ${present.borderColor}, 0 32px 64px rgba(0,0,0,0.5)`,
            }
          : { boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }),
      }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: we need this for rendering the SVG
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
