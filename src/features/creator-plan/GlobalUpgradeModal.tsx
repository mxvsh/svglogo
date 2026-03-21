import { useUpgradeModalStore } from "#/store/upgrade-modal-store";
import { CreatorPlanModal } from "./CreatorPlanModal";

export function GlobalUpgradeModal() {
  const isOpen = useUpgradeModalStore((s) => s.isOpen);
  const close = useUpgradeModalStore((s) => s.close);

  return <CreatorPlanModal isOpen={isOpen} onClose={close} />;
}
