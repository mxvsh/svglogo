import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TESTIMONIALS } from "#/data/testimonials";

const SOURCE_ICON: Record<string, string> = {
  reddit: "simple-icons:reddit",
  x: "simple-icons:x",
};

const INTERVAL = 5000;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TestimonialTicker() {
  const [sequence] = useState(() => shuffled(TESTIMONIALS));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % sequence.length),
      INTERVAL,
    );
    return () => clearInterval(t);
  }, [sequence.length]);

  const item = sequence[index];

  return (
    <div className="w-52 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col gap-1"
        >
          <p className="text-xs text-muted leading-relaxed line-clamp-2">
            "{item.quote}"
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Icon
              icon={SOURCE_ICON[item.source]}
              width={10}
              height={10}
              className="text-muted shrink-0"
            />
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted/60 truncate hover:text-muted hover:underline transition-colors"
              >
                {item.author}
              </a>
            ) : (
              <span className="text-xs text-muted/60 truncate">{item.author}</span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
