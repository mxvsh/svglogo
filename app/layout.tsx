import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "#/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "svglogo.dev - Free SVG Logo Generator",
  description:
    "Create logos in seconds with icon, color, and background controls. Export high-quality SVG, PNG, and ICO from your browser.",
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "https://svglogo.dev/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.png",
  },
  openGraph: {
    type: "website",
    siteName: "svglogo.dev",
    url: "https://svglogo.dev/",
    title: "svglogo.dev - Free SVG Logo Generator",
    description:
      "Create logos in seconds with icon, color, and background controls. Export high-quality SVG, PNG, and ICO from your browser.",
    images: [
      {
        url: "https://svglogo.dev/og/banner.png",
        alt: "svglogo.dev app preview banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "svglogo.dev - Free SVG Logo Generator",
    description:
      "Create logos in seconds with icon, color, and background controls. Export high-quality SVG, PNG, and ICO from your browser.",
    images: ["https://svglogo.dev/og/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "svglogo.dev",
    url: "https://svglogo.dev/",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    description:
      "Create logos in seconds with icon, color, and background controls. Export high-quality SVG, PNG, and ICO from your browser.",
    image: "https://svglogo.dev/og/banner.png",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: we need this
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
