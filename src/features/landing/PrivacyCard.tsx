import { Icon } from '@iconify/react'
import { Button } from '@heroui/react'
import { Card, CardLabel, CardTitle, CardDesc } from './BentoGrid'

export function PrivacyCard() {
  return (
    <Card className="col-span-1 p-6 flex flex-col justify-between gap-6" delay={0.1}>
      <div>
        <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[var(--surface-secondary)]">
          <Icon icon="lucide:lock" width={20} className="text-[var(--foreground)]" />
        </div>
        <CardLabel>Privacy</CardLabel>
        <CardTitle>Runs in Your Browser</CardTitle>
        <CardDesc>
          No server, no uploads, no account. Your designs never leave your device.
        </CardDesc>
      </div>

      <a
        href="https://github.com/monawwar/svglogo.dev"
        target="_blank"
        rel="noreferrer"
      >
        <Button variant="ghost" size="sm" className="w-full justify-between px-3">
          <span className="flex items-center gap-2">
            <Icon icon="simple-icons:github" width={13} />
            View source code
          </span>
          <Icon icon="lucide:arrow-up-right" width={13} className="text-[var(--muted)]" />
        </Button>
      </a>
    </Card>
  )
}
