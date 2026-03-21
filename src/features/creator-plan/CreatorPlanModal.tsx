import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { LAUNCH_DATE } from "#/data/creator-plan";
import { CREATOR_FEATURES } from "#/data/features";
import { signUpEarlyAccess } from "#/commands/auth/sign-up-early-access";
import { useCheckoutStore } from "#/store/checkout-store";
import { useAuth } from "#/queries/auth/use-auth";

const TOP_FEATURES = CREATOR_FEATURES.slice(0, 4);

const FOR_WHO = [
  "Freelancers & agencies",
  "Indie makers & solopreneurs",
  "Studios building for clients",
];

interface CreatorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorPlanModal({ isOpen, onClose }: CreatorPlanModalProps) {
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const openCheckout = useCheckoutStore((s) => s.open);
  const ea = user?.earlyAccess ?? "none";

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await signUpEarlyAccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = () => {
    onClose();
    openCheckout();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-primary/15 text-primary">
                <Icon icon="lucide:crown" width={20} height={20} />
              </Modal.Icon>
              <Modal.Heading>Creator Plan — Early Access</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-5">
                <p className="text-sm text-muted leading-relaxed">
                  The free editor is great for making a logo. Creator Plan is for people who need
                  everything that comes after — the assets, the variants, the full brand package.
                </p>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted/50">Who it's for</p>
                  {FOR_WHO.map((label) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-muted">
                      <Icon icon="lucide:check" width={12} className="text-primary shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted/50">What's included</p>
                  <ul className="flex flex-col gap-1.5">
                    {TOP_FEATURES.map((f) => (
                      <li key={f.label} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon icon={f.icon} width={12} className="text-primary" />
                        </div>
                        <span className="text-sm">{f.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-muted/50">
                  Launching {LAUNCH_DATE}. <br/> Early members get 20% off — pay once, own it forever.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex flex-col gap-2">
              {ea === "approved" ? (
                <Button
                  variant="primary"
                  className="w-full"
                  onPress={handleBuy}
                  data-umami-event="creator plan modal buy"
                >
                  Buy Creator Plan
                </Button>
              ) : ea === "pending" ? (
                <Button
                  variant="primary"
                  className="w-full"
                  isDisabled
                >
                  <Icon icon="lucide:check" width={14} />
                  You're on the early access list
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onPress={handleSignUp}
                  isPending={isLoading}
                  isDisabled={isLoading}
                  data-umami-event="creator plan modal early access"
                >
                  Sign up for early access
                </Button>
              )}
              <a href="/creator" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  data-umami-event="creator plan modal learn more"
                >
                  Learn more
                </Button>
              </a>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
