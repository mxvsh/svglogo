import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '#/features/landing/LandingPage'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
