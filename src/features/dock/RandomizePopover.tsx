import { Button, Label, Popover, Switch, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { randomizeLogo } from "#/commands/logo/randomize-logo";
import { trackEvent } from "#/lib/analytics";

export function RandomizePopover() {
  const [diceRotation, setDiceRotation] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [randomizeIcon, setRandomizeIcon] = useState(true);
  const [randomizeBackground, setRandomizeBackground] = useState(true);

  const runRandomize = () => {
    if (!randomizeIcon && !randomizeBackground) return;
    setDiceRotation((r) => r + 360);
    void randomizeLogo({
      icon: randomizeIcon,
      background: randomizeBackground,
    });
    trackEvent("randomize logo", { icon: randomizeIcon, background: randomizeBackground });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 72 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center rounded-2xl border border-border bg-surface/90 px-2 py-2 shadow-xl backdrop-blur-xl"
    >
      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <Tooltip.Trigger tabIndex={-1}>
            <Popover.Trigger tabIndex={-1}>
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Open randomize options"
                data-tour="randomize-button"
              >
                <motion.span
                  animate={{ rotate: diceRotation }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ display: "inline-flex" }}
                >
                  <Icon icon="lucide:dice-5" width={16} height={16} />
                </motion.span>
              </Button>
            </Popover.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p className="text-xs">Randomize</p>
          </Tooltip.Content>
        </Tooltip>

        <Popover.Content placement="top">
          <Popover.Dialog>
            <div className="flex w-52 flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted">Icon</Label>
                <Switch isSelected={randomizeIcon} onChange={setRandomizeIcon}>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted">Background</Label>
                <Switch
                  isSelected={randomizeBackground}
                  onChange={setRandomizeBackground}
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </div>

              <Button
                size="sm"
                onPress={runRandomize}
                isDisabled={!randomizeIcon && !randomizeBackground}
                className="w-full"
              >
                Randomize
              </Button>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </motion.div>
  );
}
