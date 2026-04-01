import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ANNOUNCEMENT } from "#/data/announcement";
import { useVersionCheck } from "#/hooks/use-version-check";

export function AnnouncementBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const updateAvailable = useVersionCheck();

  if (updateAvailable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30 hidden md:block"
      >
        <button
          type="button"
          onClick={() => window.location.reload()}
          data-umami-event="update banner refresh"
          className="cursor-pointer rounded-lg bg-warning/10 border border-warning/20 px-4 py-2 text-xs font-medium text-warning backdrop-blur-sm hover:bg-warning/15 transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:refresh-cw" width={12} />
          New version available — click to refresh
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30 hidden md:block"
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          data-umami-event="announcement banner click"
          data-umami-event-id={ANNOUNCEMENT.id}
          className="cursor-pointer rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-medium text-primary backdrop-blur-sm hover:bg-primary/15 transition-colors flex items-center gap-1.5"
        >
          <Icon icon={ANNOUNCEMENT.icon} width={12} />
          {ANNOUNCEMENT.label}
        </button>
      </motion.div>

      <Modal isOpen={modalOpen} onOpenChange={(open) => !open && setModalOpen(false)}>
        <Modal.Backdrop isDismissable>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Body className="p-0 overflow-hidden">
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <Modal.Icon className="bg-default text-foreground">
                    <Icon icon={ANNOUNCEMENT.icon} width={16} />
                  </Modal.Icon>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">What's new</p>
                    <h3 className="text-sm font-semibold">{ANNOUNCEMENT.heading}</h3>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-4 py-3">
                  {ANNOUNCEMENT.body.map((line, i) => (
                    <p key={i} className="text-sm text-muted leading-relaxed">{line}</p>
                  ))}
                </div>

                {ANNOUNCEMENT.cta && (
                  <div className="px-4 pb-4">
                    <a
                      href={ANNOUNCEMENT.cta.href}
                      target="_blank"
                      rel="noreferrer"
                      data-umami-event="announcement cta click"
                      data-umami-event-id={ANNOUNCEMENT.id}
                    >
                      <Button variant="primary" size="sm" className="gap-2 w-full">
                        {ANNOUNCEMENT.cta.icon && <Icon icon={ANNOUNCEMENT.cta.icon} width={13} />}
                        {ANNOUNCEMENT.cta.label}
                      </Button>
                    </a>
                  </div>
                )}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
