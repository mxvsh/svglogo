import { Button, Modal } from "@heroui/react";
import { ArrowRight, Check } from "@gravity-ui/icons";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "#/queries/auth/use-auth";
import { completeOnboarding } from "#/commands/auth/complete-onboarding";
import { updateProfileName } from "#/commands/auth/update-profile-name";
import { trackEvent } from "#/lib/analytics";
import { updateProfileRoleFn } from "#/server/profile.update-role";
import { WelcomeStep } from "./WelcomeStep";
import { RoleStep } from "./RoleStep";
import { FeaturesStep } from "./FeaturesStep";

const TOTAL_STEPS = 3;

export function WelcomeOnboarding() {
  const user = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user?.fullName ?? "");
  const [role, setRole] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user || user.onboardingCompleted) return null;

  const isLast = step === TOTAL_STEPS - 1;

  async function handleFinish() {
    setSaving(true);
    if (name.trim()) await updateProfileName(name.trim());
    if (role) {
      await updateProfileRoleFn({ data: { role } });
      trackEvent("auth onboarding role", { role });
    }
    trackEvent("auth onboarding complete");
    await completeOnboarding();
  }

  function next() {
    if (isLast) {
      handleFinish();
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <Modal isOpen>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-md">
            <Modal.Body className="p-6">
              <div className="flex gap-1.5 mb-6">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? "bg-accent" : "bg-surface-secondary"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <WelcomeStep
                    key="welcome"
                    email={user.email}
                    name={name}
                    onNameChange={setName}
                  />
                )}
                {step === 1 && (
                  <RoleStep
                    key="role"
                    selected={role}
                    onSelect={setRole}
                  />
                )}
                {step === 2 && <FeaturesStep key="features" />}
              </AnimatePresence>
            </Modal.Body>

            <Modal.Footer className="flex-row justify-between">
              <Button
                variant="ghost"
                isDisabled={step === 0}
                onPress={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
              <Button variant="primary" onPress={next} isPending={saving}>
                {isLast ? (
                  <>
                    <Check />
                    Get started
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight />
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
