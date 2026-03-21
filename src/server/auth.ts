import { getSupabaseServerClient } from "#/lib/supabase";
import { createServerFn } from "@tanstack/react-start";

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  })

export const signupFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: 'https://svglogo.dev/auth/callback' },
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  })

export const signoutFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    await supabase.auth.signOut()
  },
)

export const resendConfirmationFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    await supabase.auth.resend({ type: 'signup', email: data.email, options: { emailRedirectTo: 'https://svglogo.dev/auth/callback' } })
  })

export const oauthFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { provider: 'google' | 'github'; redirectTo: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: oauthData, error } = await supabase.auth.signInWithOAuth({
      provider: data.provider,
      options: { redirectTo: data.redirectTo },
    })

    if (error) {
      return { error: true, message: error.message }
    }

    return { url: oauthData.url }
  })
