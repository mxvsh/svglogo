import { Modal, Tabs } from "@heroui/react";
import { SignInTab } from "./SignInTab";
import { SignUpTab } from "./SignUpTab";
import { OAuthButtons } from "./OAuthButtons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
               <Modal.Heading>Login to SVGLogo</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-0">
              <Tabs className="w-full mt-4" defaultSelectedKey="signin">
                <Tabs.ListContainer>
                  <Tabs.List aria-label="Auth tabs">
                    <Tabs.Tab id="signin">
                      Sign In
                      <Tabs.Indicator className="bg-accent" />
                    </Tabs.Tab>
                    <Tabs.Tab id="signup">
                      Sign Up
                      <Tabs.Indicator className="bg-accent" />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel id="signin">
                  <SignInTab onClose={onClose} />
                </Tabs.Panel>
                <Tabs.Panel id="signup">
                  <SignUpTab />
                </Tabs.Panel>
              </Tabs>
              <OAuthButtons />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
