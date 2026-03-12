import { useEffect, useState } from "react";
import { buildBackgroundCss, buildCanvasSvg } from "#/lib/canvasUtils";
import { useLogoStore } from "#/store/logoStore";

export function LogoCanvas() {
  const present = useLogoStore((s) => s.present);
  const [svg, setSvg] = useState<string>("");

  const bgStyle = buildBackgroundCss(present.background);

  useEffect(() => {
    let cancelled = false;

    buildCanvasSvg(present, 512).then((s) => {
      if (!cancelled) setSvg(s);
    });

    return () => {
      cancelled = true;
    };
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
