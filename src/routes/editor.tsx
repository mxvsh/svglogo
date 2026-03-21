import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/features/editor/AppShell'
import { fetchSharedLogo } from '#/queries/share/use-shared-logo'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '#/lib/supabase'

interface SearchParams {
  s?: string
}

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data, error: _error } = await supabase.auth.getUser()

  if (!data.user?.email) {
    return null
  }

  const [{ data: profile }, { data: planRow }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, onboarding_completed, early_access')
      .eq('id', data.user.id)
      .single(),
    supabase
      .from('plans')
      .select('plan')
      .eq('id', data.user.id)
      .single(),
  ])

  return {
    email: data.user.email,
    fullName: (profile?.full_name as string | null) ?? null,
    onboardingCompleted: profile?.onboarding_completed ?? false,
    earlyAccess: (profile?.early_access as boolean | null) ?? null,
    plan: (planRow?.plan as string) ?? 'free',
  }
})

export const Route = createFileRoute('/editor')({
  beforeLoad: async () => {
    const user = await fetchUser()

    return {
      user,
    }
  },
  head: () => ({
    meta: [{ title: 'SVG Logo Editor — SVGLogo.dev' }],
  }),
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    s: typeof search.s === 'string' ? search.s : undefined,
  }),
  loaderDeps: ({ search }) => ({ shareId: search.s }),
  loader: async ({ deps }) => {
    if (!deps.shareId) return { sharedLogo: null }
    const sharedLogo = await fetchSharedLogo(deps.shareId)
    return { sharedLogo }
  },
  component: EditorRoute,
})

function EditorRoute() {
  const { user } = Route.useRouteContext()
  const { sharedLogo } = Route.useLoaderData()
  return (
    <AppShell
      sharedLogo={sharedLogo}
      user={user ? { email: user.email, fullName: user.fullName, onboardingCompleted: user.onboardingCompleted, earlyAccess: user.earlyAccess, plan: user.plan } : null}
    />
  )
}
