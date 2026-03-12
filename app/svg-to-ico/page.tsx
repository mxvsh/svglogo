import type { Metadata } from "next";
import { SeoLandingPage } from "#/components/seo/SeoLandingPage";

const title = "SVG to ICO Converter for Favicons and App Icons";
const description =
  "Convert SVG logos into ICO-ready artwork for favicons, desktop shortcuts, and Windows app icons. Use svglogo.dev to design in SVG first, then export clean raster icon formats from the browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://svglogo.dev/svg-to-ico",
  },
  openGraph: {
    title,
    description,
    url: "https://svglogo.dev/svg-to-ico",
  },
  twitter: {
    title,
    description,
  },
};

export default function SvgToIcoPage() {
  return (
    <SeoLandingPage
      eyebrow="SVG Export Guide"
      title="SVG to ICO converter workflow for crisp favicons"
      description={description}
      intro={[
        "SVG is ideal for editing logos because vectors stay sharp at any size. ICO is still useful when you need a favicon, a Windows shortcut icon, or a packaged desktop-app asset that depends on raster icon sizes.",
        "The cleanest workflow is to start with an SVG logo, simplify the silhouette, keep contrast high, and export image sizes that hold up at 16x16, 32x32, and 48x48. svglogo.dev helps with the design side first so the final icon remains legible after conversion.",
      ]}
      bullets={[
        "Build the source icon in the browser with customizable icon, color, background, and corner radius controls.",
        "Preview simple shapes before exporting so the icon survives tiny favicon sizes.",
        "Export SVG, PNG, and ICO-friendly assets from one tool instead of switching between design apps.",
      ]}
      steps={[
        "Choose a simple icon or mark that still reads clearly when reduced to favicon size.",
        "Set your icon color and background contrast so the edges remain visible on browser tabs and bookmarks bars.",
        "Adjust padding and corner radius until the logo feels balanced inside a square artboard.",
        "Export your artwork, then use the raster output for favicon bundles or ICO packaging where required.",
      ]}
      useCases={[
        "Website favicons where you want a custom mark instead of generic text.",
        "Electron, Tauri, and Windows desktop apps that need small launcher icons.",
        "Internal admin tools or SaaS products that need consistent icon assets across multiple surfaces.",
      ]}
      faq={[
        {
          question: "Why not use the raw SVG directly as a favicon?",
          answer:
            "Modern browsers support SVG favicons in many cases, but ICO and PNG are still common fallback formats for broader compatibility and packaging workflows.",
        },
        {
          question: "What makes an SVG good for ICO conversion?",
          answer:
            "Simple geometry, strong contrast, and enough padding around the shape matter more than decorative details. Small ICO sizes punish thin strokes and crowded artwork.",
        },
        {
          question: "Can I use svglogo.dev if I do not have design software?",
          answer:
            "Yes. The app is designed for browser-based logo and icon creation, so you can generate the starting SVG without Illustrator, Figma, or Sketch.",
        },
      ]}
      primaryCta={{
        href: "/",
        label: "Create an SVG icon",
      }}
      relatedPages={[
        {
          href: "/svg-to-png",
          label: "SVG to PNG",
          description:
            "Create raster exports for websites, app stores, social previews, and documentation.",
        },
        {
          href: "/svg-to-favicon",
          label: "SVG to favicon",
          description:
            "A focused guide for favicon-ready logo design and browser-tab clarity.",
        },
        {
          href: "/logo-maker",
          label: "Logo maker",
          description:
            "Design the source logo first before exporting it into multiple file types.",
        },
      ]}
    />
  );
}
