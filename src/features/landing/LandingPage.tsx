import { GridBackground } from '#/features/editor/GridBackground'
import { HeroSection } from './HeroSection'
import { BentoGrid } from './BentoGrid'
import { TestimonialsSection } from './TestimonialsSection'
import { FaqSection } from './FaqSection'
import { LandingFooter } from './LandingFooter'

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10">
        <HeroSection />
        <BentoGrid />
        <TestimonialsSection />
        <FaqSection />
        <LandingFooter />
      </div>
    </div>
  )
}
