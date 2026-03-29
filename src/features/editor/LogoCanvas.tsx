import { buildBackgroundCss } from "#/domain/logo/logo.svg-builder";
import { useLogoSvg } from "#/queries/logo/use-logo-svg";
import { useLogoState } from "#/queries/logo/use-logo-state";

export function LogoCanvas() {
  const present = useLogoState();
  const svg = useLogoSvg();
  const bgStyle = buildBackgroundCss(present.background);

  return (
    <div
      className="relative aspect-square w-[min(78vw,58dvh)] max-w-[512px] shrink-0 [&>svg]:h-full [&>svg]:w-full"
      data-tour="canvas"
      style={{
        borderRadius: `${(present.borderRadius / 512) * 100}%`,
        overflow: "hidden",
        ...bgStyle,
        ...(present.borderWidth > 0
          ? {
              boxShadow: `inset 0 0 0 ${present.borderWidth}px ${present.borderColor}, 0 32px 64px rgba(0,0,0,0.5)`,
            }
          : { boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }),
      }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: rendering the SVG
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
