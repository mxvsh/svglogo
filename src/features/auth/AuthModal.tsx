import { Modal } from "@heroui/react";
import { useState } from "react";
import { useCollectionStore } from "#/store/collection-store";
import { getCollectionsFn } from "#/server/collection.get";
import type { CollectionItem } from "#/domain/collection/collection.types";
import { SignInTab } from "./SignInTab";
import { SignUpTab } from "./SignUpTab";
import { OAuthButtons } from "./OAuthButtons";
import { CollectionSyncModal } from "./CollectionSyncModal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signedUp, setSignedUp] = useState(false);
  const [syncModal, setSyncModal] = useState(false);
  const [cloudCollections, setCloudCollections] = useState<CollectionItem[]>([]);
  const localCollections = useCollectionStore((s) => s.collections);

  async function handleSignedIn() {
    // If onboarding is pending, the onboarding modal handles sync on the last step
    const session = await import("#/lib/auth-client").then((m) => m.authClient.getSession());
    const onboardingCompleted = session.data?.user.onboardingCompleted ?? false;
    onClose();

    if (!onboardingCompleted) return;

    const cloud = await getCollectionsFn() as CollectionItem[];
    if (cloud.length === 0) return;

    if (localCollections.length === 0) {
      useCollectionStore.getState().loadCollections(cloud);
      return;
    }

    setCloudCollections(cloud);
    setSyncModal(true);
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setSignedUp(false); } }}>
        <Modal.Backdrop isDismissable>
          <Modal.Container className="sm:max-w-120">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header className="pt-5 flex items-center">
                <img src="/logo512.png" alt="SVGLogo" className="w-16 h-16 rounded-xl" />
              </Modal.Header>
              <Modal.Body className="p-4">
                {mode === "signin"
                  ? <SignInTab onSignedIn={handleSignedIn} />
                  : <SignUpTab onSuccess={() => setSignedUp(true)} />}
                {!signedUp && (
                  <>
                    <OAuthButtons onSignedIn={handleSignedIn} />
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
                  </>
                )}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <CollectionSyncModal
        isOpen={syncModal}
        cloudCount={cloudCollections.length}
        localCount={localCollections.length}
        cloudCollections={cloudCollections}
        onClose={() => setSyncModal(false)}
      />
    </>
  );
}
