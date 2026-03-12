import type { Metadata } from "next";
import { SeoLandingPage } from "#/components/seo/SeoLandingPage";

const title = "SVG to Favicon Guide for Modern Websites";
const description =
  "Create favicon-ready SVG logo assets with practical guidance on contrast, sizing, and fallbacks. svglogo.dev helps you design simple marks that hold up in browser tabs and saved shortcuts.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://svglogo.dev/svg-to-favicon",
  },
  openGraph: {
    title,
    description,
    url: "https://svglogo.dev/svg-to-favicon",
  },
  twitter: {
    title,
    description,
  },
};

export default function SvgToFaviconPage() {
  return (
    <SeoLandingPage
      eyebrow="Favicon Design"
      title="SVG to favicon best practices for tiny icons"
      description={description}
      intro={[
        "A favicon is one of the smallest but most repeated pieces of branding on the web. Browser tabs, bookmarks, reading lists, pinned shortcuts, and installed web apps all rely on tiny icon assets that need to communicate fast.",
        "That makes source design more important than the conversion step. A favicon works when the shape is bold, the negative space is clear, and the composition does not depend on fine strokes or text.",
      ]}
      bullets={[
        "Use a simple icon-first logo instead of a full wordmark for browser tabs.",
        "Test contrast against both light and dark browser chrome conditions.",
        "Keep one SVG source and derive favicon-ready raster assets from the same design.",
      ]}
      steps={[
        "Start with a symbol or monogram that still reads at 16x16.",
        "Increase padding slightly so the icon does not feel cramped inside the square.",
        "Avoid long text, thin outlines, and low-contrast gradients for primary favicon assets.",
        "Export the final design into the formats your stack needs for broad browser support.",
      ]}
      useCases={[
        "New startup websites that need a recognizable tab icon quickly.",
        "Product refreshes where the brand mark exists but favicon assets do not.",
        "Developers packaging PWAs or SaaS apps with browser and shortcut icons.",
      ]}
      faq={[
        {
          question: "Should my favicon match my full logo exactly?",
          answer:
            "Not always. The favicon usually works best as a distilled symbol or initial that matches the brand rather than a reduced full lockup.",
        },
        {
          question: "Is text a good idea in a favicon?",
          answer:
            "Usually no, unless it is a single bold letter. Most text becomes unreadable once the icon is reduced to tab size.",
        },
        {
          question: "Can one SVG source support multiple favicon outputs?",
          answer:
            "Yes. That is the ideal approach because you preserve one editable master and export the raster sizes or containers your app needs.",
        },
      ]}
      primaryCta={{
        href: "/",
        label: "Start with a favicon-ready icon",
      }}
      relatedPages={[
        {
          href: "/svg-to-ico",
          label: "SVG to ICO",
          description:
            "Package your favicon work into classic ICO-compatible outputs when needed.",
        },
        {
          href: "/svg-to-png",
          label: "SVG to PNG",
          description:
            "Use PNG exports for docs, previews, and upload surfaces that do not support SVG.",
        },
        {
          href: "/logo-maker",
          label: "Logo maker",
          description:
            "Build the source mark before worrying about final favicon packaging.",
        },
      ]}
    />
  );
}
