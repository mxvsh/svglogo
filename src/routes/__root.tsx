import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { FAQ_JSON_LD, JSON_LD, SEO, SITE_NAME, SITE_URL } from '../data/site'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
