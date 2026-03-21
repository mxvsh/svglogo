import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LAUNCH_DATE, PRICE_ONE_TIME, PRICE_ONE_TIME_EARLY, EARLY_ACCESS_DISCOUNT } from "#/data/creator-plan";
import { ArrowRight } from "@gravity-ui/icons";
import { useAuth } from "#/queries/auth/use-auth";

const LS_KEY = "creator_card_collapsed";

import { CREATOR_FEATURES } from "#/data/features";

const TOP_CREATOR_FEATURES = CREATOR_FEATURES.slice(0, 5);

export function CreatorPlanCard() {
  const user = useAuth();
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(LS_KEY) === "1",
  );

  if (user?.plan === "creator") return null;

  function toggle() {
    const next = !collapsed;
    localStorage.setItem(LS_KEY, next ? "1" : "0");
    setCollapsed(next);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-4 top-4 z-20 hidden md:block"
    >
      <motion.div
        animate={{ width: collapsed ? "auto" : 240 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/20"
      >
        {/* Header — always visible */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">Creator Plan</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary whitespace-nowrap">
              {EARLY_ACCESS_DISCOUNT * 100}% off
            </span>
          </div>
          <button
            type="button"
            onClick={toggle}
            data-umami-event={collapsed ? "creator card expand" : "creator card collapse"}
            className="text-muted/40 transition-colors hover:text-muted shrink-0"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <Icon icon="lucide:chevron-up" width={13} />
            </motion.div>
          </button>
        </div>

        {/* Collapsible body */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="px-4 pb-4">
                <ul className="mb-4 space-y-1.5">
                  {TOP_CREATOR_FEATURES.map((f) => (
                    <li key={f.label} className="flex items-center gap-2 text-xs text-muted">
                      <Icon icon={f.icon} width={11} className="shrink-0 text-primary/60" />
                      {f.label}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-xs text-muted/50">
                    <Icon icon="lucide:ellipsis" width={11} className="shrink-0" />
                    and more
                  </li>
                </ul>

                <div className="mb-3 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold tabular-nums">${PRICE_ONE_TIME_EARLY}</span>
                  <span className="text-xs text-muted line-through">${PRICE_ONE_TIME}</span>
                  <span className="text-xs text-muted">one-time</span>
                </div>

                <a
                  href="/creator"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="creator card cta click"
                >
                  <Button size="sm" className="w-full text-xs">
                    Get early access <ArrowRight />
                  </Button>
                </a>
                <p className="mt-2 text-center text-[10px] text-muted/50">Launches {LAUNCH_DATE}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
