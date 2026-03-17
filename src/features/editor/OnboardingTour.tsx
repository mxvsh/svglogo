import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { trackEvent } from "#/lib/analytics";

const STORAGE_KEY = "svglogo-onboarding-seen";
const PADDING = 12;

type Step = {
  target: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    target: '[data-tour="canvas"]',
    title: "Live preview",
    description:
      "This canvas updates as you change the icon, colors, background, and shape.",
  },
  {
    target: '[data-tour="icon-button"]',
    title: "Pick an icon",
    description:
      "Start here to choose the symbol for your logo. You can also press I to open the picker.",
  },
  {
    target: '[data-tour="background-button"]',
    title: "Set the background",
    description:
      "Switch between solid colors and gradients to create the base tile behind your icon.",
  },
  {
    target: '[data-tour="border-radius-button"]',
    title: "Shape the tile",
    description:
      "Adjust the border and corner radius to make the logo feel softer, sharper, or more app-like.",
  },
  {
    target: '[data-tour="randomize-button"]',
    title: "Generate ideas",
    description:
      "Use randomize when you want quick visual directions without manually changing every control.",
  },
  {
    target: '[data-tour="export-button"]',
    title: "Export assets",
    description:
      "Download your design as SVG, PNG, or ICO once the logo looks right.",
  },
];

type SpotlightRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"welcome" | "tour">("welcome");
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const step = STEPS[stepIndex];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    if (window.innerWidth < 768) return;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen || stage !== "tour" || !step) return;

    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      const element = document.querySelector(step.target);
      if (!(element instanceof HTMLElement)) { setRect(null); return; }
      const bounds = element.getBoundingClientRect();
      setRect({
        left: Math.max(0, bounds.left - PADDING),
        top: Math.max(0, bounds.top - PADDING),
        width: bounds.width + PADDING * 2,
        height: bounds.height + PADDING * 2,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, stage, step]);

  const cardStyle = (() => {
    if (!rect) return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };

    const cardWidth = 360;
    const gap = 20;
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    left = Math.max(24, Math.min(left, viewport.width - cardWidth - 24));
    let top = rect.top + rect.height + gap;
    if (top + 220 > viewport.height - 24) top = Math.max(24, rect.top - 220 - gap);
    return { left: `${left}px`, top: `${top}px` };
  })();

  const closeTour = (reason: "skip" | "finish") => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
    trackEvent(`onboarding ${reason}`);
  };

  const nextStep = () => {
    if (stepIndex === STEPS.length - 1) { closeTour("finish"); return; }
    setStepIndex((i) => i + 1);
  };

  const startTour = () => {
    setStage("tour");
    trackEvent("onboarding start");
  };

  if (!isOpen || !step) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      {stage === "welcome" ? (
        <div className="pointer-events-auto absolute left-1/2 top-1/2 w-105 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-border bg-surface p-6 shadow-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Welcome
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Quick tour of SVGLogo
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            This short walkthrough highlights the six controls you will use
            most: the preview canvas, icon picker, background, border and
            radius, randomize, and export.
          </p>
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="ghost" onPress={() => closeTour("skip")}>Skip</Button>
            <Button variant="primary" onPress={startTour}>Start tour</Button>
          </div>
        </div>
      ) : (
        <>
          {rect && (
            <div
              className="absolute rounded-3xl"
              style={{
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                border: "1px solid color-mix(in oklab, var(--accent) 42%, var(--surface))",
                boxShadow: "0 0 0 4px color-mix(in oklab, var(--accent) 14%, transparent)",
              }}
            />
          )}
          <div
            className="pointer-events-auto absolute w-90 max-w-[calc(100vw-3rem)] rounded-[1.75rem] border border-border bg-surface p-5 shadow-2xl"
            style={cardStyle}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              Onboarding {stepIndex + 1}/{STEPS.length}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {step.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {step.description}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button variant="ghost" onPress={() => closeTour("skip")}>Skip</Button>
              <div className="flex gap-2">
                {stepIndex > 0 && (
                  <Button variant="outline" onPress={() => setStepIndex((i) => i - 1)}>
                    Back
                  </Button>
                )}
                <Button variant="primary" onPress={nextStep}>
                  {stepIndex === STEPS.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
