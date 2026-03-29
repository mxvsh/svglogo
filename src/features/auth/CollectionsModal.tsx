import { Button, Modal, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { format } from "timeago.js";
import { loadLogoFromState } from "#/commands/logo/load-logo";
import { createShareLink } from "#/commands/share/create-share-link";
import { useCollections } from "#/queries/collection/use-collections";

interface CollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CollectionsModal({ isOpen, onClose }: CollectionsModalProps) {
  const collections = useCollections();
  const recent = collections.slice(0, 5);

  async function handleShare(index: number) {
    const logo = collections[index];
    loadLogoFromState(logo);
    const url = await createShareLink();
    await navigator.clipboard.writeText(url);
    toast("Share link copied");
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Icon icon="lucide:layers" width={20} />
              </Modal.Icon>
              <div>
                <Modal.Heading>Collections</Modal.Heading>
                <p className="text-xs text-muted">{collections.length} saved logo{collections.length !== 1 ? "s" : ""}</p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-5 py-6">

              {collections.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Icon icon="lucide:layers" width={28} className="text-muted" />
                  <p className="text-sm text-muted">No saved logos yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {recent.map((logo, i) => (
                    <div
                      key={logo.id}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-default/50 transition-colors"
                    >
                      <div
                        className="h-9 w-9 shrink-0 rounded-lg border border-border/50 flex items-center justify-center"
                        style={{
                          background:
                            logo.background.type === "solid"
                              ? logo.background.color
                              : logo.background.type === "gradient"
                              ? `linear-gradient(${logo.background.direction}deg, ${logo.background.stops[0].color}, ${logo.background.stops[1].color})`
                              : "transparent",
                        }}
                      >
                        {logo.textMode && logo.logoText ? (
                          <span
                            className="text-[9px] font-bold leading-none"
                            style={{ color: logo.iconColor, fontFamily: logo.fontFamily }}
                          >
                            {logo.logoText}
                          </span>
                        ) : (
                          <Icon icon={logo.iconName} width={18} style={{ color: logo.iconColor }} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {logo.textMode && logo.logoText
                            ? logo.logoText
                            : logo.iconName.split(":")[1] || logo.iconName}
                        </p>
                        <p className="text-xs text-muted">{format(logo.savedAt)}</p>
                      </div>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label="Share"
                        onPress={() => void handleShare(i)}
                      >
                        <Icon icon="lucide:share-2" width={14} />
                      </Button>
                    </div>
                  ))}

                  {collections.length > 5 && (
                    <p className="text-center text-xs text-muted pt-1">
                      +{collections.length - 5} more in the editor
                    </p>
                  )}
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
