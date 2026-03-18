import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Is SVGLogo.dev really free?',
    a: 'Yes, completely. There are no tiers, no watermarks, no paid exports, and no limits. It has always been free and will always be free.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account, no email, no sign-up of any kind. Just open the editor and start creating.',
  },
  {
    q: 'Is my data private?',
    a: 'Everything runs directly in your browser. Your logo designs are never sent to any server unless you explicitly click "Share" to generate a shareable link.',
  },
  {
    q: 'What file formats can I export?',
    a: 'You can export SVG, PNG, and ICO. You can also generate complete platform icon packs for iOS, Android, macOS, and Web/PWA with correctly sized and named assets.',
  },
  {
    q: 'Can I use exported logos commercially?',
    a: 'The app is free to use for any purpose. Keep in mind that the underlying icons come from various open-source icon libraries — check each library\'s license (most use MIT or Apache 2.0).',
  },
  {
    q: 'What icon sets are available?',
    a: 'Lucide, Material Design, Tabler, Phosphor, Simple Icons, and many more — over 300,000 icons in total via the Iconify library.',
  },
]

function FaqItem({
  q,
  a,
  delay,
}: {
  q: string
  a: string
  delay: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[var(--border)] last:border-0"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium text-[var(--foreground)]">{q}</span>
        <Icon
          icon="lucide:chevron-down"
          width={16}
          className={`mt-0.5 shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm text-[var(--muted)] leading-relaxed">{a}</p>
      )}
    </motion.div>
  )
}

export function FaqSection() {
  return (
    <section className="px-4 pb-24 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Common questions
        </h2>
        <p className="text-[var(--muted)] text-lg">
          Everything you need to know before you start.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6">
        {FAQS.map((faq, i) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} delay={i * 0.04} />
        ))}
      </div>
    </section>
  )
}
