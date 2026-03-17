import { useEffect, useRef, useState } from "react";
import { buildCanvasSvgSync } from "#/domain/logo/logo.svg-builder";
import type { IconSvgCache } from "#/domain/icon/icon.types";
import { fetchIconSvgs } from "#/infra/iconify/iconify-client";
import { useLogoStore } from "#/store/logo-store";

export function useLogoSvg() {
  const present = useLogoStore((s) => s.present);
  const iconName = useLogoStore((s) => s.present.iconName);
  const iconColor = useLogoStore((s) => s.present.iconColor);
  const iconBorderColor = useLogoStore((s) => s.present.iconBorderColor);
  const iconBorderWidth = useLogoStore((s) => s.present.iconBorderWidth);

  const [svg, setSvg] = useState<string>("");
  const cacheRef = useRef<IconSvgCache | null>(null);
  const presentRef = useRef(present);
  presentRef.current = present;

  // Fetch icon SVGs only when icon identity fields change
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
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally limited to icon identity fields
  }, [iconName, iconColor, iconBorderColor, iconBorderWidth]);

  // Rebuild synchronously from cache when only layout/transform props change
  useEffect(() => {
    if (!cacheRef.current) return;
    setSvg(buildCanvasSvgSync(present, cacheRef.current, 512));
  }, [present]);

  return svg;
}
