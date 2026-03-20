import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { creatorSignupFn } from "#/server/creator-signup";
import { LAUNCH_DATE } from "#/data/creator-plan";

const TURNSTILE_SITE_KEY = "0x4AAAAAACsp6BY1heuKsB5N"
const SCRIPT_ID = "cf-turnstile-script";

const ease = [0.22, 1, 0.36, 1] as const;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; size: string; execution: string }) => string;
      execute: (id: string, opts: { callback: (t: string) => void; "error-callback": () => void }) => void;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById(SCRIPT_ID)) { resolve(); return; }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function EmailForm() {
  const [email, setEmail] = useState("");
  const [signedup, setSignedup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    let cancelled = false;
    loadTurnstileScript().then(() => {
      if (cancelled || !turnstileRef.current) return;
      widgetId.current = window.turnstile?.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        size: "invisible",
        execution: "execute",
      }) ?? null;
    });
    return () => {
      cancelled = true;
      if (widgetId.current != null) {
        window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  const handleSignup = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      let token = "";
      if (TURNSTILE_SITE_KEY && widgetId.current != null) {
        token = await new Promise<string>((resolve, reject) => {
          window.turnstile?.reset(widgetId.current!);
          window.turnstile?.execute(widgetId.current!, {
            callback: resolve,
            "error-callback": () => reject(new Error("Bot check failed")),
          });
        });
      }
      await creatorSignupFn({ data: { email: email.trim(), token } });
      setSignedup(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#a78bfa", "#818cf8", "#c4b5fd", "#ffffff"],
      });
    } catch {
      setError("Something went wrong. Please try again.");
      if (widgetId.current != null) window.turnstile?.reset(widgetId.current);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={turnstileRef} />
      <div className="h-[72px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {signedup ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:check" width={12} className="text-success" />
                </div>
                You're in — early access price secured
              </div>
              <p className="text-xs text-(--muted)/70">We'll reach out before {LAUNCH_DATE}.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  variant="secondary"
                  className="w-full sm:w-60"
                  disabled={loading}
                />
                <Button
                  onPress={handleSignup}
                  isDisabled={!email.trim()}
                  isPending={loading}
                  data-umami-event="creator early access signup"
                  className="w-full sm:w-auto"
                >
                  Get early access
                </Button>
              </div>
              {error && <p className="text-xs text-danger">{error}</p>}
              <p className="text-xs text-(--muted)/60">No spam. One email when we launch.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
