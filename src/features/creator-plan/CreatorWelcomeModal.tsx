import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import confetti from "canvas-confetti";
import { completeCreatorOnboarding } from "#/commands/auth/complete-creator-onboarding";
import { CREATOR_FEATURES } from "#/data/features";

interface CreatorWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorWelcomeModal({ isOpen, onClose }: CreatorWelcomeModalProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClose = async () => {
    setIsPending(true);
    try {
      await completeCreatorOnboarding();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#a78bfa", "#818cf8", "#c4b5fd", "#ffffff"],
      });
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon className="bg-primary/15 text-primary">
                <Icon icon="lucide:crown" width={20} height={20} />
              </Modal.Icon>
              <Modal.Heading>Welcome to Creator Plan</Modal.Heading>
              <p className="text-sm text-muted">You now have access to everything.</p>
            </Modal.Header>

            <Modal.Body>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted/50">
                  Unlocked for you
                </p>
                <ul className="flex flex-col gap-2">
                  {CREATOR_FEATURES.slice(0, 6).map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon icon={f.icon} width={12} className="text-primary" />
                      </div>
                      <span className="text-sm">{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                className="w-full"
                onPress={handleClose}
                isPending={isPending}
                isDisabled={isPending}
                data-umami-event="creator welcome start"
              >
                Start creating
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
