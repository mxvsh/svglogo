import type { Metadata } from "next";
import { SeoLandingPage } from "#/components/seo/SeoLandingPage";

const title = "SVG to PNG Converter for Logos, Apps, and Social Media";
const description =
  "Turn SVG artwork into PNG-ready logo assets for websites, mobile apps, social sharing, documentation, and presentations. Design your source logo in svglogo.dev and export clean image assets from the browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://svglogo.dev/svg-to-png",
  },
  openGraph: {
    title,
    description,
    url: "https://svglogo.dev/svg-to-png",
  },
  twitter: {
    title,
    description,
  },
};

export default function SvgToPngPage() {
  return (
    <SeoLandingPage
      eyebrow="Raster Export"
      title="SVG to PNG for product logos and web graphics"
      description={description}
      intro={[
        "PNG is still the most practical export format when you need a transparent raster image for websites, app listings, changelogs, slide decks, or social preview cards. SVG remains the best editable master file because it scales cleanly and is easier to update later.",
        "A good SVG-to-PNG workflow begins with a balanced square composition. That matters because the exported PNG is only as good as the source logo, and tiny alignment or spacing issues become obvious when the image is shared outside the design tool.",
      ]}
      bullets={[
        "Generate the original logo as SVG so you keep a scalable source file for future edits.",
        "Export PNG for surfaces that expect raster images, including docs, uploads, and marketplaces.",
        "Use the same icon and color system across SVG, PNG, and favicon assets to keep brand output consistent.",
      ]}
      steps={[
        "Create or refine the icon mark in svglogo.dev and choose a square composition that feels centered.",
        "Pick a solid or gradient background depending on whether the PNG needs transparency or a framed logo tile.",
        "Check how the design looks at smaller sizes and simplify it if the edges feel noisy.",
        "Export the result as PNG for the channels that do not support inline SVG well.",
      ]}
      useCases={[
        "Uploading logos to product directories, CMS systems, and no-code tools that only accept PNG.",
        "Sharing transparent brand marks in documentation, presentations, or press kits.",
        "Generating social or marketplace assets from a single SVG source design.",
      ]}
      faq={[
        {
          question: "When should I choose PNG instead of SVG?",
          answer:
            "Use PNG when the destination does not reliably support SVG or when you need a fixed raster image with transparency for uploads and previews.",
        },
        {
          question: "Will a PNG stay sharp on high-density screens?",
          answer:
            "Yes, if you export at a large enough size. The advantage of designing in SVG first is that you can produce larger PNG outputs without redrawing the logo.",
        },
        {
          question: "Can I keep a transparent background?",
          answer:
            "Yes. Transparent PNG output is commonly used for overlays, documentation, and brand assets placed on different backgrounds.",
        },
      ]}
      primaryCta={{
        href: "/",
        label: "Design and export a logo",
      }}
      relatedPages={[
        {
          href: "/svg-to-ico",
          label: "SVG to ICO",
          description:
            "Prepare favicon and Windows icon workflows from the same base artwork.",
        },
        {
          href: "/svg-to-favicon",
          label: "SVG to favicon",
          description:
            "Learn how to design a favicon that still reads clearly at tiny sizes.",
        },
        {
          href: "/logo-maker",
          label: "Logo maker",
          description:
            "Start with a clean SVG logo before exporting any raster variants.",
        },
      ]}
    />
  );
}
