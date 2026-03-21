import { Avatar, Button, Label, Modal, Separator } from "@heroui/react";
import { CrownDiamond } from "@gravity-ui/icons";
import type { AuthUser } from "#/store/auth-store";
import { signoutFn } from "#/server/auth";
import { setUser } from "#/commands/auth/set-user";

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
}

function getInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function MyAccountModal({ isOpen, onClose, user }: MyAccountModalProps) {
  async function handleSignOut() {
    await signoutFn();
    setUser(null);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>My Account</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <Avatar.Fallback>{getInitials(user.fullName, user.email)}</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  {user.fullName && (
                    <p className="text-sm font-medium">{user.fullName}</p>
                  )}
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              </div>

              <Separator orientation="horizontal" variant="secondary" />

              <div className="flex items-center justify-between">
                <Label className="text-sm">Plan</Label>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  {user.plan === "creator" ? (
                    <>
                      <CrownDiamond className="size-3.5 text-primary" />
                      Creator
                    </>
                  ) : (
                    "Free"
                  )}
                </span>
              </div>

              {user.earlyAccess === true && user.plan !== "creator" && (
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Early Access</Label>
                  <span className="text-xs text-primary font-medium">Enrolled</span>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer className="flex justify-end">
              <Button variant="ghost" onPress={handleSignOut}>
                Sign out
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
