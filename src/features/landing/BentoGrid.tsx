import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { PrivacyCard } from './PrivacyCard'

// A broad sample of icons from different supported sets
const PREVIEW_ICONS = [
  'lucide:rocket',
  'lucide:star',
  'lucide:heart',
  'lucide:zap',
  'lucide:code-2',
  'lucide:coffee',
  'lucide:flame',
  'lucide:globe',
  'lucide:music',
  'lucide:camera',
  'ph:brain',
  'ph:lightning',
  'ph:planet',
  'ph:leaf',
  'tabler:brand-github',
  'tabler:crystal-ball',
  'simple-icons:react',
  'simple-icons:figma',
  'simple-icons:typescript',
  'mdi:robot',
]

const EXPORT_FORMATS = [
  { label: 'SVG', icon: 'lucide:file-code-2', desc: 'Scalable vector' },
  { label: 'PNG', icon: 'lucide:image', desc: 'High-res raster' },
  { label: 'ICO', icon: 'lucide:monitor', desc: 'Windows favicon' },
  { label: 'Favicon', icon: 'lucide:globe', desc: 'Browser tab icon' },
]

const PLATFORM_PACKS = [
  { label: 'iOS', icon: 'simple-icons:apple' },
  { label: 'Android', icon: 'simple-icons:android' },
  { label: 'macOS', icon: 'simple-icons:macos' },
  { label: 'Web / PWA', icon: 'lucide:chrome' },
]

const GRADIENTS = [
  'from-blue-500 via-purple-500 to-pink-500',
  'from-orange-400 via-rose-500 to-red-600',
  'from-emerald-400 via-teal-500 to-cyan-600',
]

function cardVariants(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  }
}

export function Card({
  className,
  children,
  delay,
}: {
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      {...cardVariants(delay)}
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden relative ${className ?? ''}`}
    >
      {children}
    </motion.div>
  )
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]/50 mb-1.5">
      {children}
    </p>
  )
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
      {children}
    </h3>
  )
}

export function CardDesc({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-[var(--muted)] leading-relaxed">{children}</p>
  )
}

// Card: 300k+ Icons (2 cols wide, shows icon grid)
function IconsCard() {
  return (
    <Card className="col-span-1 md:col-span-2 p-6" delay={0}>
      <CardLabel>Icon Library</CardLabel>
      <CardTitle>300,000+ Icons</CardTitle>
      <CardDesc>
        Lucide, Material Design, Tabler, Phosphor, Simple Icons, and more.
      </CardDesc>
      <div className="mt-5 grid grid-cols-10 gap-2 relative">
        {PREVIEW_ICONS.map((icon) => (
          <div
            key={icon}
            className="flex items-center justify-center size-8 rounded-lg bg-[var(--surface-secondary)]"
          >
            <Icon icon={icon} width={16} className="text-[var(--foreground)]" />
          </div>
        ))}
        {/* Fade overlay at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--surface)] to-transparent" />
      </div>
    </Card>
  )
}

// Card: Free Forever
function FreeCard() {
  return (
    <Card className="col-span-1 p-6 flex flex-col" delay={0.05}>
      <CardLabel>Pricing</CardLabel>
      <div className="text-5xl font-bold text-[var(--foreground)] my-3 leading-none">
        $0
      </div>
      <CardTitle>Free Forever</CardTitle>
      <CardDesc>
        No freemium tiers, no watermarks, no limits. Free today, free tomorrow,
        always.
      </CardDesc>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
        <Icon icon="lucide:check-circle-2" width={14} />
        No credit card ever
      </div>
    </Card>
  )
}

// Card: Export formats (2 cols wide)
function ExportCard() {
  return (
    <Card className="col-span-1 md:col-span-2 p-6" delay={0.1}>
      <CardLabel>Export</CardLabel>
      <CardTitle>Any Format, Any Platform</CardTitle>
      <CardDesc>
        One-click export plus full platform asset bundles — sized and named for
        iOS, Android, macOS, and Web.
      </CardDesc>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {EXPORT_FORMATS.map((f) => (
          <div
            key={f.label}
            className="flex flex-col gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3"
          >
            <Icon icon={f.icon} width={18} className="text-[var(--foreground)]" />
            <p className="text-sm font-semibold">{f.label}</p>
            <p className="text-xs text-[var(--muted)]">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PLATFORM_PACKS.map((p) => (
          <span
            key={p.label}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
          >
            <Icon icon={p.icon} width={11} />
            {p.label} pack
          </span>
        ))}
      </div>
    </Card>
  )
}

// Card: Gradients
function GradientCard() {
  return (
    <Card className="col-span-1 p-6" delay={0.15}>
      <div className="mb-4 flex flex-col gap-1.5">
        {GRADIENTS.map((g) => (
          <div key={g} className={`h-5 rounded-lg bg-gradient-to-r ${g}`} />
        ))}
      </div>
      <CardLabel>Backgrounds</CardLabel>
      <CardTitle>Multi-stop Gradients</CardTitle>
      <CardDesc>
        Solid colors or rich multi-stop gradients with full angle and color
        control.
      </CardDesc>
    </Card>
  )
}

// Card: Share
function ShareCard() {
  return (
    <Card className="col-span-1 p-6" delay={0.18}>
      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[var(--surface-secondary)]">
        <Icon
          icon="lucide:share-2"
          width={20}
          className="text-[var(--foreground)]"
        />
      </div>
      <CardLabel>Collaboration</CardLabel>
      <CardTitle>Share with a Link</CardTitle>
      <CardDesc>
        Generate a shareable URL in one click. Anyone can open and remix your
        logo.
      </CardDesc>
    </Card>
  )
}

// Card: Collections
function CollectionsCard() {
  return (
    <Card className="col-span-1 p-6" delay={0.22}>
      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[var(--surface-secondary)]">
        <Icon
          icon="lucide:bookmark"
          width={20}
          className="text-[var(--foreground)]"
        />
      </div>
      <CardLabel>Organization</CardLabel>
      <CardTitle>Save Collections</CardTitle>
      <CardDesc>
        Bookmark your favorite logo variations locally — no account, no cloud.
      </CardDesc>
    </Card>
  )
}

export function BentoGrid() {
  return (
    <section id="features" className="px-4 pb-24 max-w-5xl mx-auto scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Everything you need
        </h2>
        <p className="text-[var(--muted)] text-lg">
          A full logo toolkit without the bloat.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Row 1 */}
        <IconsCard />
        <FreeCard />
        {/* Row 2 */}
        <PrivacyCard />
        <ExportCard />
        {/* Row 3 */}
        <GradientCard />
        <ShareCard />
        <CollectionsCard />
      </div>
    </section>
  )
}
