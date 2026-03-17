import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/features/editor/AppShell'
import { fetchSharedLogo } from '#/queries/share/use-shared-logo'

interface SearchParams {
  s?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    s: typeof search.s === 'string' ? search.s : undefined,
  }),
  loaderDeps: ({ search }) => ({ shareId: search.s }),
  loader: async ({ deps }) => {
    if (!deps.shareId) return { sharedLogo: null }
    const sharedLogo = await fetchSharedLogo(deps.shareId)
    return { sharedLogo }
  },
  component: App,
})

function App() {
  const { sharedLogo } = Route.useLoaderData()
  return <AppShell sharedLogo={sharedLogo} />
}
