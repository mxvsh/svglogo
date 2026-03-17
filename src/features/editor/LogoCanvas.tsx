import { buildBackgroundCss } from "#/domain/logo/logo.svg-builder";
import { useLogoSvg } from "#/queries/logo/use-logo-svg";
import { useLogoState } from "#/queries/logo/use-logo-state";

export function LogoCanvas() {
  const present = useLogoState();
  const svg = useLogoSvg();
  const bgStyle = buildBackgroundCss(present.background);

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
      // biome-ignore lint/security/noDangerouslySetInnerHtml: rendering the SVG
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
