export const SITE_URL = 'https://svglogo.dev'
export const SITE_NAME = 'SVGLogo.dev'

export const SEO = {
  title: 'SVG Logo Maker - Free SVG Logo Generator',
  description:
    'Free SVG logo maker to create professional icons and brand marks in seconds. Customize icons, colors, and backgrounds. Export high-quality SVG, PNG, and ICO from your browser.',
  keywords:
    'svg logo maker, svg logo generator, free logo maker, logo svg generator, svg logo creator, free svg logo, icon logo maker, logo maker online, svg to png, svg to ico, favicon generator, brand mark creator',
  ogImage: `${SITE_URL}/screenshot.png`,
  ogImageAlt: 'svglogo.dev app preview banner',
  canonical: `${SITE_URL}/`,
} as const


export const FAQ_ITEMS = [
  {
    q: 'Is SVGLogo.dev really 100% free?',
    a: 'Yes — every feature is completely free with no paywalls, no limits, and no sign-up required. Brand kits, code export, premium icon sets, infinite mode — all free.',
  },
  {
    q: 'Is SVGLogo.dev open source?',
    a: 'Yes! The source code is available on GitHub at github.com/mxvsh/svglogo. Contributions are welcome.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account, no email, no sign-up of any kind. Just open it and start creating. You can optionally sign in to sync collections.',
  },
  {
    q: 'Is my data private?',
    a: 'Everything runs directly in your browser. Your logo designs are never sent to any server unless you explicitly click "Share" to generate a shareable link.',
  },
  {
    q: 'What file formats can I export?',
    a: 'You can export SVG, PNG, and ICO. You can also export as React, Vue, or Svelte code, generate brand kits, and create complete platform icon packs.',
  },
  {
    q: 'Can I use exported logos commercially?',
    a: "The app is free to use for any purpose. Keep in mind that the underlying icons come from various open-source icon libraries — check each library's license (most use MIT or Apache 2.0).",
  },
  {
    q: 'What icon sets are available?',
    a: 'Lucide, Material Design, Tabler, Phosphor, Streamline, OpenMoji, and many more — over 300,000 icons in total via the Iconify library.',
  },
] as const

export const FAQ_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
})

export const JSON_LD = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: 'Free SVG logo maker to create professional icons and brand marks in seconds.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_NAME} - SVG Logo Maker`,
    url: `${SITE_URL}/`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    description: SEO.description,
    image: SEO.ogImage,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Create SVG logos from icons',
      'Customize colors, gradients, and backgrounds',
      'Export to SVG, PNG, and ICO formats',
      'Generate favicons from SVG',
      'Browser-based, no signup required',
      'Share logos with a link',
    ],
  },
])
