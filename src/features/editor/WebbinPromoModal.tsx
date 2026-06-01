import { Modal } from '@heroui/react'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'webbin-promo-seen'

interface Props {
  isOpen?: boolean
  onClose?: () => void
}

export function WebbinPromoModal({ isOpen: externalOpen, onClose: externalClose }: Props = {}) {
  const [internalOpen, setInternalOpen] = useState(false)

  useEffect(() => {
    if (externalOpen === undefined && !localStorage.getItem(STORAGE_KEY)) {
      setInternalOpen(true)
    }
  }, [])

  const isOpen = externalOpen ?? internalOpen

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, '1')
    setInternalOpen(false)
    externalClose?.()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container className="sm:max-w-md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Body className="p-0 overflow-hidden">
              <a href="https://webbin.dev?utm_source=svglogo" target="_blank" rel="noreferrer" onClick={handleClose} data-umami-event="webbin promo banner click">
                <img
                  src="/webbin-banner.png"
                  alt="Webbin — AI-powered websites"
                  className="w-full block rounded-2xl"
                />
              </a>
              <div className="py-4">
                <p className="text-sm font-semibold text-foreground">Build your business website in minutes</p>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Webbin generates a fully designed, SEO-ready website from your Google Maps or Instagram profile — no design skills needed.
                </p>
                <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/10 px-3 py-2">
                  <div>
                    <p className="text-xs text-muted">Exclusive offer for SVGLogo users</p>
                    <p className="text-sm font-bold text-foreground tracking-widest">SVGLOGO</p>
                  </div>
                  <span className="text-xs font-semibold text-green-400 bg-green-400/10 rounded-md px-2 py-1">20% off</span>
                </div>
                <a
                  href="https://webbin.dev?utm_source=svglogo"
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleClose}
                  data-umami-event="webbin promo cta click"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
                  Try Webbin for free →
                </a>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
