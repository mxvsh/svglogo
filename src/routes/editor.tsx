import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from '@heroui/react'
import { useEffect } from 'react'
import { AppShell } from '#/features/editor/AppShell'
import { fetchSharedLogo } from '#/queries/share/use-shared-logo'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '#/lib/supabase'

interface SearchParams {
  s?: string
  upgraded?: string
  auth_error?: string
  error_description?: string
  error?: string
}

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data, error: _error } = await supabase.auth.getUser()

  if (!data.user?.email) {
    return null
  }

  const [{ data: profile }, { data: planRow }, { data: earlyAccessRow }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, onboarding_completed, creator_onboarded')
      .eq('id', data.user.id)
      .single(),
    supabase
      .from('plans')
      .select('plan')
      .eq('id', data.user.id)
      .single(),
    supabase
      .from('early_access')
      .select('status')
      .eq('email', data.user.email.toLowerCase())
      .maybeSingle(),
  ])

  const earlyAccess: 'none' | 'pending' | 'approved' =
    earlyAccessRow == null ? 'none' : earlyAccessRow.status ? 'approved' : 'pending'

  return {
    email: data.user.email,
    fullName: (profile?.full_name as string | null) ?? null,
    onboardingCompleted: profile?.onboarding_completed ?? false,
    earlyAccess,
    plan: (planRow?.plan as string) ?? 'free',
    creatorOnboarded: profile?.creator_onboarded ?? false,
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
    upgraded: typeof search.upgraded === 'string' ? search.upgraded : undefined,
    auth_error: typeof search.auth_error === 'string' ? search.auth_error : undefined,
    error_description: typeof search.error_description === 'string' ? search.error_description : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
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
  const { upgraded, auth_error, error_description, error } = Route.useSearch()
  const navigate = useNavigate()

  useEffect(() => {
    if (upgraded === '1') {
      navigate({ to: '/editor', search: {}, replace: true })
    }
  }, [upgraded, navigate])

  useEffect(() => {
    const msg = auth_error || error_description || error
    if (msg) {
      toast(msg.replace(/\+/g, ' '))
      navigate({ to: '/editor', search: {}, replace: true })
    }
  }, [auth_error, error_description, error, navigate])

  return (
    <AppShell
      sharedLogo={sharedLogo}
      user={user ? { email: user.email, fullName: user.fullName, onboardingCompleted: user.onboardingCompleted, earlyAccess: user.earlyAccess, plan: user.plan, creatorOnboarded: user.creatorOnboarded } : null}
    />
  )
}
