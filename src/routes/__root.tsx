import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { FAQ_JSON_LD, JSON_LD, SEO, SITE_NAME } from '../data/site'
import { Toast } from '@heroui/react'
import { getSessionFn } from '#/server/auth.session'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const session = await getSessionFn();
    context.queryClient.setQueryData(["session"], session);
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SEO.title },
      { name: 'description', content: SEO.description },
      { name: 'keywords', content: SEO.keywords },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:url', content: SEO.canonical },
      { property: 'og:title', content: SEO.title },
      { property: 'og:description', content: SEO.description },
      { property: 'og:image', content: SEO.ogImage },
      { property: 'og:image:alt', content: SEO.ogImageAlt },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SEO.title },
      { name: 'twitter:description', content: SEO.description },
      { name: 'twitter:image', content: SEO.ogImage },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: SEO.canonical },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {import.meta.env.PROD && (<script defer src="https://cloud.livedot.dev/t.js" data-website="29013677-b291-48ad-b122-26833ff63ede"></script>)}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Bricolage+Grotesque:wght@700&family=Comfortaa:wght@700&family=Cormorant+Garamond:wght@700&family=Crimson+Pro:wght@700&family=DM+Sans:wght@700&family=Fira+Code:wght@700&family=Fraunces:wght@700&family=Fredoka:wght@600&family=Instrument+Sans:wght@700&family=JetBrains+Mono:wght@700&family=Libre+Baskerville:wght@700&family=Lora:wght@700&family=Manrope:wght@700&family=Merriweather:wght@700&family=Montserrat:wght@800&family=Outfit:wght@700&family=Pacifico&family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@700&family=Poppins:wght@700&family=Raleway:wght@700&family=Righteous&family=Sora:wght@700&family=Space+Grotesk:wght@700&family=Space+Mono:wght@700&family=Unbounded:wght@700&family=Urbanist:wght@700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
          dangerouslySetInnerHTML={{ __html: JSON_LD }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
          dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }}
        />
      </head>
      <body className="font-sans antialiased">
        <TanStackQueryProvider>
          {children}
          <Toast.Provider placement='top' />
        </TanStackQueryProvider>
        <Scripts />
        {import.meta.env.PROD && (
          <script
            defer
            src="https://analytics.monawwar.io/script.js"
            data-website-id="f883cc7f-5dc4-4045-b1ad-c279fcce963c"
          />
        )}
      </body>
    </html>
  )
}
