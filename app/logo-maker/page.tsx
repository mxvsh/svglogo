import type { Metadata } from "next";
import { SeoLandingPage } from "#/components/seo/SeoLandingPage";

const title = "Free Logo Maker for SVG, PNG, and ICO Exports";
const description =
  "Use svglogo.dev as a free browser-based logo maker. Create simple icon logos, customize colors and backgrounds, and export SVG, PNG, and ICO-ready assets for websites and apps.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://svglogo.dev/logo-maker",
  },
  openGraph: {
    title,
    description,
    url: "https://svglogo.dev/logo-maker",
  },
  twitter: {
    title,
    description,
  },
};

export default function LogoMakerPage() {
  return (
    <SeoLandingPage
      eyebrow="Logo Creation"
      title="Free logo maker for simple SVG brand marks"
      description={description}
      intro={[
        "svglogo.dev is built for people who need a clean logo mark without a heavy design workflow. It focuses on icon-based logos that can be customized quickly and exported into practical formats for websites, apps, and side projects.",
        "That makes it useful for founders, indie hackers, developers, and designers who want a fast starting point. You can create the base SVG logo first, then generate PNG or favicon variants from the same artwork instead of rebuilding assets for every channel.",
      ]}
      bullets={[
        "Pick from icons, colors, gradients, borders, and rounded-square backgrounds.",
        "Keep the source asset editable as SVG while also supporting export-friendly output for product surfaces.",
        "Move from idea to usable logo asset in the browser without opening a full design suite.",
      ]}
      steps={[
        "Choose an icon that matches the product category or brand personality.",
        "Customize the color palette, background treatment, and scale until the mark feels balanced.",
        "Test the logo as a standalone square so it works for app icons and social avatars too.",
        "Export the result in the file type you need for launch assets, docs, or favicons.",
      ]}
      useCases={[
        "Launching a new product quickly when you need an MVP brand asset now.",
        "Generating app icons and logo tiles for internal tools or client prototypes.",
        "Creating a visual starting point before handing brand work to a designer later.",
      ]}
      faq={[
        {
          question: "Is this better for icon logos or full brand systems?",
          answer:
            "It is best for simple icon-based logo creation and export workflows. Full identity systems usually need additional typography and brand-guideline work.",
        },
        {
          question: "Can I export more than one format?",
          answer:
            "Yes. The product positioning centers on creating the SVG source and then using PNG and ICO-friendly outputs where needed.",
        },
        {
          question: "Who is this tool for?",
          answer:
            "It fits developers, solo founders, indie products, hackathon teams, and anyone who needs a practical browser-based logo workflow.",
        },
      ]}
      primaryCta={{
        href: "/",
        label: "Open the logo maker",
      }}
      relatedPages={[
        {
          href: "/svg-to-png",
          label: "SVG to PNG",
          description:
            "Convert the logo into transparent raster assets for uploads and docs.",
        },
        {
          href: "/svg-to-ico",
          label: "SVG to ICO",
          description:
            "Turn the same logo into favicon and Windows icon workflows.",
        },
        {
          href: "/svg-to-favicon",
          label: "SVG to favicon",
          description: "Optimize your logo mark for tiny browser-tab usage.",
        },
      ]}
    />
  );
}
