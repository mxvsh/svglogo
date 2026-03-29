import { Heart, HeartFill } from "@gravity-ui/icons";
import { Button, Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { areLogosEqual } from "#/domain/logo/logo.validators";
import { saveToCollection } from "#/commands/collection/save-to-collection";
import { removeFromCollection } from "#/commands/collection/remove-from-collection";
import { useCollections } from "#/queries/collection/use-collections";
import { useLogoState } from "#/queries/logo/use-logo-state";

export function HistoryButton() {
  const currentLogo = useLogoState();
  const collections = useCollections();
  const [isAnimating, setIsAnimating] = useState(false);

  const matchedLogo = useMemo(() => {
    return collections.find((c) => areLogosEqual(c, currentLogo));
  }, [collections, currentLogo]);

  const isLiked = !!matchedLogo;

  const handleSave = () => {
    if (isLiked) {
      void removeFromCollection(matchedLogo.id);
    } else {
      void saveToCollection();
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 72 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center rounded-2xl border border-border bg-surface/90 px-2 py-2 shadow-xl backdrop-blur-xl"
    >
      <Tooltip delay={200}>
        <Tooltip.Trigger tabIndex={-1}>
          <Button onPress={handleSave} isIconOnly variant="ghost">
            <motion.span
              animate={
                isAnimating
                  ? {
                      scale: [1, 0.8, 1.4, 1],
                    }
                  : { scale: 1 }
              }
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              {isLiked ? <HeartFill className="text-pink-500" /> : <Heart />}
            </motion.span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>{isLiked ? "Remove" : "Save"}</Tooltip.Content>
      </Tooltip>
    </motion.div>
  );
}
