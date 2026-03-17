import {
  ArrowShapeTurnUpRight,
  Check,
  Copy,
  NodesRight,
} from "@gravity-ui/icons";
import { Button, Input, Modal, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { createShareLink } from "#/commands/share/create-share-link";
import { trackEvent } from "#/lib/analytics";

export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const open = () => {
    setIsOpen(true);
    trackEvent("open share modal");
  };
  const dismiss = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      setShareError(null);
      createShareLink()
        .then((url) => {
          if (url) {
            setShareUrl(url);
          } else {
            setShareError("Failed to generate link");
          }
        })
        .catch((err: unknown) => {
          console.error("Share error:", err);
          setShareError(
            err instanceof Error ? err.message : "Failed to generate link",
          );
        });
    } else {
      setShareUrl(null);
      setShareError(null);
      setCopied(false);
    }
  }, [isOpen]);

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent("copy share link");
  };

  const handleShareOnX = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(
      `Check out the logo I made with @svglogo_dev!\n\nEdit here: ${shareUrl}`,
    );
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
    trackEvent("share on x");
  };

  return (
    <>
      <Tooltip delay={0}>
        <Button size="lg" onPress={open} variant="outline">
          <ArrowShapeTurnUpRight width={18} height={18} />
          Share
        </Button>
        <Tooltip.Content placement="left">
          <p>Share your logo</p>
        </Tooltip.Content>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) dismiss();
        }}
      >
        <Modal.Backdrop isDismissable>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-default text-foreground">
                  <NodesRight className="size-5" />
                </Modal.Icon>
                <Modal.Heading>Share your work</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    Anyone with this link can view and edit a copy of this logo.
                  </p>
                  <div className="flex gap-2 w-full items-center overflow-visible">
                    <div className="relative flex-1 min-w-0 overflow-visible">
                      {shareError ? (
                        <p className="text-sm text-danger">{shareError}</p>
                      ) : (
                        <Input
                          readOnly
                          value={shareUrl || "Generating link..."}
                          variant="secondary"
                          fullWidth
                          className={"focus:ring-inset"}
                        />
                      )}
                    </div>
                    <Button
                      isIconOnly
                      onPress={copyLink}
                      isDisabled={!shareUrl || !!shareError}
                      variant="ghost"
                      className="min-w-10 h-10"
                    >
                      {copied ? <Check width={18} /> : <Copy width={18} />}
                    </Button>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-between">
                <p className="text-muted text-sm">
                  Get a retweet by sharing on X!
                </p>
                <Button
                  variant="ghost"
                  onPress={handleShareOnX}
                  isDisabled={!shareUrl}
                  className="gap-2"
                >
                  <Icon icon="simple-icons:x" width={14} />
                  Share on X
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
