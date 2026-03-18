import { Icon } from '@iconify/react'
import { Button } from '@heroui/react'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[88vh] px-4 pt-24 pb-0 text-center">
      <motion.div
        className="flex flex-col items-center max-w-4xl w-full"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          The Free SVG
          <br />
          <span className="bg-linear-to-r from-muted via-(--foreground)/80 to-muted bg-clip-text text-transparent">Logo Maker</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Pick from 300,000+ icons, customize colors and multi-stop gradients,
          export to SVG, PNG, ICO, or favicon — entirely in your browser.
        </motion.p>

        {/* Privacy note */}
        <motion.p
          className="text-sm text-[var(--muted)]/60 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: 'easeOut' }}
        >
          Everything stays in your browser. 100% Open-source.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="/editor">
            <Button
              size="lg"
              color="primary"
              className="font-semibold px-8 gap-2"
            >
              Open Web Editor
              <Icon icon="lucide:arrow-right" width={16} />
            </Button>
          </a>
          <Button
            size="lg"
            variant="ghost"
            className="text-muted"
            onPress={() =>
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            See features
          </Button>
        </motion.div>

        {/* App screenshot */}
        <motion.div
          className="mt-16 w-full max-w-4xl mb-24"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/40">
            <img
              src="/screenshot.png"
              alt="SVGLogo.dev editor — SVG logo maker interface"
              className="w-full block"
              width={1280}
              height={800}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
