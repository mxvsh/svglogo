import { Modal } from "@heroui/react";
import { useState } from "react";
import { SignInTab } from "./SignInTab";
import { SignUpTab } from "./SignUpTab";
import { OAuthButtons } from "./OAuthButtons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container className="sm:max-w-120">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header className="pt-5 flex items-center">
              <img src="/logo512.png" alt="SVGLogo" className="w-16 h-16 rounded-xl" />
            </Modal.Header>
            <Modal.Body className="p-4">
              {mode === "signin" ? <SignInTab onClose={onClose} /> : <SignUpTab />}
              <OAuthButtons />
              <p className="text-center text-xs text-muted mt-4">
                {mode === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="text-accent hover:underline font-medium">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => setMode("signin")} className="text-accent hover:underline font-medium">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
