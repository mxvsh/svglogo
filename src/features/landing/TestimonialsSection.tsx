import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { TESTIMONIALS } from '#/data/testimonials'

const SOURCE_ICON: Record<string, string> = {
  reddit: 'simple-icons:reddit',
  x: 'simple-icons:x',
}

export function TestimonialsSection() {
  return (
    <section className="px-4 pb-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Loved by makers
        </h2>
        <p className="text-[var(--muted)] text-lg">
          What people are saying across the web.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.45,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-3"
          >
            <p className="text-sm text-[var(--foreground)] leading-relaxed flex-1">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-2">
              <Icon
                icon={SOURCE_ICON[t.source]}
                width={12}
                className="text-[var(--muted)] shrink-0"
              />
              {t.url ? (
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--muted)]/70 hover:text-[var(--muted)] hover:underline transition-colors truncate"
                >
                  {t.author}
                </a>
              ) : (
                <span className="text-xs text-[var(--muted)]/70 truncate">
                  {t.author}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
