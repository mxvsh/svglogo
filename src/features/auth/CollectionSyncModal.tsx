import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { CollectionItem } from "#/domain/collection/collection.types";
import { useCollectionStore } from "#/store/collection-store";

interface CollectionSyncModalProps {
  isOpen: boolean;
  cloudCount: number;
  localCount: number;
  cloudCollections: CollectionItem[];
  onClose: () => void;
}

export function CollectionSyncModal({
  isOpen,
  cloudCount,
  localCount,
  cloudCollections,
  onClose,
}: CollectionSyncModalProps) {
  const { loadCollections, mergeCollections } = useCollectionStore();

  function handleReplace() {
    loadCollections(cloudCollections);
    onClose();
  }

  function handleMerge() {
    mergeCollections(cloudCollections);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Body className="flex flex-col gap-5 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon icon="lucide:cloud-download" width={22} className="text-primary" />
              </div>

              <div>
                <h2 className="text-base font-bold">Sync your logos</h2>
                <p className="mt-1 text-sm text-muted">
                  You have <span className="font-medium text-foreground">{localCount} local</span> and{" "}
                  <span className="font-medium text-foreground">{cloudCount} cloud</span> saved logos.
                  What would you like to do?
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleMerge}
                  className="flex items-start gap-3 rounded-xl border-2 border-border bg-transparent px-4 py-3 text-left transition-all hover:border-accent/40 hover:bg-accent/5 cursor-pointer"
                >
                  <Icon icon="lucide:git-merge" width={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-medium">Merge</p>
                    <p className="text-xs text-muted">Combine local and cloud logos, keeping all unique ones.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleReplace}
                  className="flex items-start gap-3 rounded-xl border-2 border-border bg-transparent px-4 py-3 text-left transition-all hover:border-danger/40 hover:bg-danger/5 cursor-pointer"
                >
                  <Icon icon="lucide:cloud" width={18} className="mt-0.5 shrink-0 text-danger" />
                  <div>
                    <p className="text-sm font-medium">Use cloud</p>
                    <p className="text-xs text-muted">Replace local logos with your cloud collection.</p>
                  </div>
                </button>
              </div>

              <Button variant="ghost" size="sm" className="w-full" onPress={onClose}>
                Keep local only
              </Button>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
