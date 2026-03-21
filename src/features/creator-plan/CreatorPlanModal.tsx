import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import { LAUNCH_DATE } from "#/data/creator-plan";

const FEATURES = [
  { icon: "lucide:type", label: "Premium fonts and icons" },
  { icon: "lucide:swatch-book", label: "Curated color palette" },
  { icon: "lucide:image", label: "Infinite logo variations" },
  { icon: "lucide:package", label: "Full brand kit export (Instagram, Twitter, LinkedIn)" },
];

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
                    {FEATURES.map((f) => (
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
            <Modal.Footer>
              <a href="/creator" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  className="w-full"
                  data-umami-event="creator plan modal lean more"
                >
                  Learn more & get early access
                  <Icon icon="lucide:arrow-up-right" width={14} />
                </Button>
              </a>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
