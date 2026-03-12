"use client";

import { Bell } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { AppNotification } from "#/lib/notifications";

const STORAGE_KEY = "svglogo-seen-notification1";

export default function UpdatesFab({
  notification,
}: {
  notification: AppNotification | null;
}) {
  const [showFab, setShowFab] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!notification) return setShowFab(false);
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen === notification.id) {
      setShowFab(false);
    } else {
      setShowFab(true);
    }
  }, [notification]);

  const open = () => setIsOpen(true);
  const dismiss = () => {
    if (notification) {
      localStorage.setItem(STORAGE_KEY, notification.id);
    }
    setIsOpen(false);
    setShowFab(false);
  };

  if (!notification) return null;

  return (
    <>
      {showFab && (
        <Button
          aria-label="Show updates"
          onClick={open}
          className="fixed bottom-6 right-6 z-10"
          isIconOnly
          variant="outline"
          size="lg"
        >
          <Bell />
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) dismiss();
        }}
      >
        <Modal.Backdrop isDismissable>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>{notification.title}</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              {notification.banner && (
                <div className="px-6 pt-2">
                  <Image
                    src={notification.banner}
                    alt={notification.title}
                    width={600}
                    height={300}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
              )}
              <Modal.Body>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-side HTML from own API
                  dangerouslySetInnerHTML={{ __html: notification.description }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={dismiss}>Got it</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
