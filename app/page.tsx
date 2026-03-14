import DesktopAppShell from "#/components/DesktopAppShell";
import DesktopOnlyNotice from "#/components/DesktopOnlyNotice";
import { fetchLatestNotification } from "#/lib/notifications";
import { redis } from "#/lib/redis";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  searchParams: Promise<{ s?: string }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const s = searchParams.s;
  
  if (!s) return {};

  const ogImageUrl = `https://svglogo.dev/api/og?s=${s}`;

  return {
    metadataBase: new URL("https://svglogo.dev"),
    title: "SVGLogo.dev - Custom Logo",
    description: "Check out this custom logo created on SVGLogo.dev",
    openGraph: {
      type: "website",
      siteName: "svglogo.dev",
      title: "Custom Logo on SVGLogo.dev",
      description: "Create your own professional icons in seconds.",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 675,
          alt: "Custom Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@svglogo_dev",
      title: "Custom Logo on SVGLogo.dev",
      description: "Create your own professional icons in seconds.",
      images: [ogImageUrl],
    },
  };
}

export default async function Home(props: {
  searchParams: Promise<{ s?: string }>;
}) {
  const searchParams = await props.searchParams;
  const shareId = searchParams.s;
  let sharedLogo = null;

  if (shareId) {
    try {
      const data = await redis.get(`share:${shareId}`);
      if (data) {
        sharedLogo = JSON.parse(data);
      }
    } catch (error) {
      console.error("Failed to fetch shared logo:", error);
    }
  }

  const notification = await fetchLatestNotification();

  return (
    <>
      <DesktopOnlyNotice shareId={shareId} />
      <DesktopAppShell notification={notification} sharedLogo={sharedLogo} />
    </>
  );
}
