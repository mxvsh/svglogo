import { Button, Form, Input, Label, Meter, Modal, Switch, TextField, toast } from "@heroui/react";
import confetti from "canvas-confetti";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "#/queries/auth/use-session";
import { useCollections } from "#/queries/collection/use-collections";
import { completeOnboardingFn } from "#/server/user.complete-onboarding";
import { USER_ROLES, type UserRole } from "../../../drizzle/schema";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; icon: string }> = {
  designer: { label: "Designer", icon: "lucide:pen-tool" },
  developer: { label: "Developer", icon: "lucide:code-2" },
  founder: { label: "Founder", icon: "lucide:rocket" },
  marketer: { label: "Marketer", icon: "lucide:megaphone" },
  student: { label: "Student", icon: "lucide:graduation-cap" },
  other: { label: "Other", icon: "lucide:user" },
};

type Step = "welcome" | "profile" | "role" | "sync";
const STEPS: Step[] = ["welcome", "profile", "role", "sync"];

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 20 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -20 }),
};

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { data: session, refetch } = useSession();
  const collections = useCollections();
  const [step, setStep] = useState<Step>("welcome");
  const [dir, setDir] = useState(1);
  const [name, setName] = useState(session?.user.name ?? "");
  const [role, setRole] = useState<UserRole | null>(null);
  const [syncCollections, setSyncCollections] = useState(true);
  const [loading, setLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  function goTo(next: Step) {
    setDir(STEPS.indexOf(next) > stepIndex ? 1 : -1);
    setStep(next);
  }

  async function handleFinish() {
    setLoading(true);
    const result = await completeOnboardingFn({
      data: {
        name: name.trim() || "Friend",
        role,
        collectionsToSync: syncCollections ? collections : [],
      },
    });

    if (result?.error) {
      toast("Something went wrong, please try again.");
      setLoading(false);
      return;
    }

    await refetch();
    void confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container className="sm:max-w-lg">
          <Modal.Dialog style={{ height: 420 }} className="flex flex-col">

            {/* Progress bars */}
            <div className="flex shrink-0 gap-1.5 p-5 pb-0">
              {STEPS.map((s, i) => (
                <Meter key={s} value={i <= stepIndex ? 100 : 0} color={i <= stepIndex ? "accent" : "default"}>
                  <Meter.Track className="h-1">
                    <Meter.Fill />
                  </Meter.Track>
                </Meter>
              ))}
            </div>

            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col gap-5 p-5"
                >
                  {/* Step 1 — Welcome */}
                  {step === "welcome" && (
                    <>
                      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                        <img src="/logo512.png" alt="SVGLogo" className="h-16 w-16 rounded-2xl shadow-lg" />
                        <div className="flex flex-col gap-1">
                          <h2 className="text-xl font-bold">Welcome to SVGLogo</h2>
                          <p className="text-sm text-muted">Create and sync beautiful logos, free forever.</p>
                        </div>
                        {collections.length > 0 && (
                          <div className="flex items-center gap-2 rounded-full border border-border bg-default/40 px-4 py-2 text-xs text-muted">
                            <Icon icon="lucide:layers" width={13} className="text-primary" />
                            <span>
                              <span className="font-semibold text-foreground">{collections.length}</span> local logo{collections.length !== 1 ? "s" : ""} ready to sync
                            </span>
                          </div>
                        )}
                      </div>

                      <Button variant="primary" className="w-full" onPress={() => goTo("profile")}>
                        Get Started
                      </Button>
                    </>
                  )}

                  {/* Step 2 — Profile */}
                  {step === "profile" && (
                    <Form
                      className="flex flex-col gap-4"
                      style={{ height: "100%" }}
                      onSubmit={(e) => { e.preventDefault(); goTo("role"); }}
                    >
                      <div className="flex items-center gap-3">
                        {session?.user.image ? (
                          <img src={session.user.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                            {name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <div>
                          <h2 className="text-lg font-bold">Set up your profile</h2>
                          <p className="text-sm text-muted">How should we address you?</p>
                        </div>
                      </div>

                      <TextField name="name" value={name} onChange={setName}>
                        <Label>Full name</Label>
                        <Input placeholder="Your name" variant="secondary" autoFocus className="focus:ring-inset" />
                      </TextField>

                      <div className="mt-auto flex gap-2">
                        <Button variant="outline" className="flex-1" onPress={() => goTo("welcome")}>Back</Button>
                        <Button type="submit" variant="primary" className="flex-1">Continue</Button>
                      </div>
                    </Form>
                  )}

                  {/* Step 3 — Role */}
                  {step === "role" && (
                    <>
                      <div>
                        <h2 className="text-lg font-bold">What describes you?</h2>
                        <p className="text-sm text-muted">Helps us tailor the experience for you.</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {USER_ROLES.map((r) => {
                          const { label, icon } = ROLE_LABELS[r];
                          const selected = role === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRole(r)}
                              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs transition-colors ${
                                selected
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-border bg-transparent text-muted hover:border-border/60"
                              }`}
                            >
                              <Icon icon={icon} width={18} />
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-auto flex gap-2">
                        <Button variant="outline" className="flex-1" onPress={() => goTo("profile")}>Back</Button>
                        <Button variant="primary" className="flex-1" onPress={() => goTo("sync")}>Continue</Button>
                      </div>
                    </>
                  )}

                  {/* Step 4 — Sync */}
                  {step === "sync" && (
                    <>
                      <div>
                        <h2 className="text-lg font-bold">Sync your collection</h2>
                        <p className="text-sm text-muted">Back up your local logos to the cloud.</p>
                      </div>

                      {collections.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-default/50">
                            <Icon icon="lucide:layers" width={22} className="text-muted" />
                          </div>
                          <p className="text-sm font-medium">No local logos</p>
                          <p className="text-xs text-muted">You haven't saved any logos locally yet.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between rounded-xl border border-border bg-default/30 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <Icon icon="lucide:layers" width={18} className="text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {collections.length} saved logo{collections.length !== 1 ? "s" : ""}
                                </p>
                                <p className="text-xs text-muted">Stored locally on this device</p>
                              </div>
                            </div>
                            <Icon icon="lucide:arrow-right" width={16} className="text-muted" />
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                              <Icon icon="lucide:cloud" width={18} className="text-primary" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between rounded-xl border border-border bg-default/30 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <Icon icon="lucide:cloud-upload" width={18} className="text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Sync to my account</p>
                                <p className="text-xs text-muted">{collections.length} logo{collections.length !== 1 ? "s" : ""} will be uploaded</p>
                              </div>
                            </div>
                            <Switch isSelected={syncCollections} onChange={setSyncCollections}>
                              <Switch.Control><Switch.Thumb /></Switch.Control>
                            </Switch>
                          </div>
                        </div>
                      )}

                      <div className="mt-auto flex gap-2">
                        <Button variant="outline" className="flex-1" onPress={() => goTo("role")}>Back</Button>
                        <Button
                          variant="primary"
                          className="flex-1"
                          isPending={loading}
                          onPress={() => void handleFinish()}
                        >
                          Finish
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
