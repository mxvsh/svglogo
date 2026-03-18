export const SITE_URL = 'https://svglogo.dev'
export const SITE_NAME = 'SVGLogo.dev'

export const SEO = {
  title: 'SVG Logo Maker - Free SVG Logo Generator',
  description:
    'Free SVG logo maker to create professional icons and brand marks in seconds. Customize icons, colors, and backgrounds. Export high-quality SVG, PNG, and ICO from your browser.',
  keywords:
    'svg logo maker, svg logo generator, free logo maker, logo svg generator, svg logo creator, free svg logo, icon logo maker, logo maker online, svg to png, svg to ico, favicon generator, brand mark creator',
  ogImage: `${SITE_URL}/og/banner.png`,
  ogImageAlt: 'svglogo.dev app preview banner',
  canonical: `${SITE_URL}/`,
} as const

export const FAQ_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is SVGLogo.dev really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely. There are no tiers, no watermarks, no paid exports, and no limits. It has always been free and will always be free.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account, no email, no sign-up of any kind. Just open the editor and start creating.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Everything runs directly in your browser. Your logo designs are never sent to any server unless you explicitly click Share to generate a shareable link.',
      },
    },
    {
      '@type': 'Question',
      name: 'What file formats can I export?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can export SVG, PNG, and ICO. You can also generate complete platform icon packs for iOS, Android, macOS, and Web/PWA.',
      },
    },
    {
      '@type': 'Question',
      name: 'What icon sets are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lucide, Material Design, Tabler, Phosphor, Simple Icons, and many more — over 300,000 icons in total via the Iconify library.',
      },
    },
  ],
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
