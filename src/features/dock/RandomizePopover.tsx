import { Button, Label, Popover, Switch, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Check } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import palettes from "nice-color-palettes/200.json";
import { randomizeLogo } from "#/commands/logo/randomize-logo";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function RandomizePopover() {
  const textMode = useLogoStore((s) => s.present.textMode);
  const [diceRotation, setDiceRotation] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<string[] | null>(null);
  const [custom, setCustom] = useState(false);
  const [randomizeIcon, setRandomizeIcon] = useState(true);
  const [randomizeIconColor, setRandomizeIconColor] = useState(true);
  const [randomizeBackground, setRandomizeBackground] = useState(true);
  const [randomizeFont, setRandomizeFont] = useState(true);
  const [randomizeFontColor, setRandomizeFontColor] = useState(true);

  const usePalette = !!selectedPalette;
  const nothingSelected = custom && !randomizeBackground && (textMode ? (!randomizeFont && !randomizeFontColor) : (!randomizeIcon && !randomizeIconColor));

  const lastRun = useRef(0);

  const runRandomize = () => {
    const now = Date.now();
    if (now - lastRun.current < 400) return;
    lastRun.current = now;
    setDiceRotation((r) => r + 360);
    const palette = selectedPalette ?? undefined;
    if (!custom) {
      void randomizeLogo({ smart: true, palette });
      trackEvent("randomize logo", { mode: "smart", text_mode: textMode, use_palette: usePalette });
    } else {
      if (nothingSelected) return;
      void randomizeLogo({
        icon: !textMode && randomizeIcon,
        iconColor: textMode ? randomizeFontColor : randomizeIconColor,
        background: randomizeBackground,
        font: textMode && randomizeFont,
        palette,
      });
      trackEvent("randomize logo", {
        mode: "custom",
        text_mode: textMode,
        ...(textMode
          ? { font_style: randomizeFont, font_color: randomizeFontColor, background: randomizeBackground }
          : { icon: randomizeIcon, icon_color: randomizeIconColor, background: randomizeBackground }),
      });
    }
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
            <div className="flex w-56 flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Palette</Label>
                  <p className="text-xs text-muted">Constrain colors</p>
                </div>
                <Popover isOpen={paletteOpen} onOpenChange={setPaletteOpen}>
                  <Popover.Trigger>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted hover:text-foreground transition-colors"
                    >
                      {selectedPalette ? (
                        <div className="flex gap-0.5">
                          {selectedPalette.map((c) => (
                            <div key={c} className="size-3 rounded-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      ) : (
                        "None"
                      )}
                      <Icon icon="lucide:chevron-down" width={12} />
                    </button>
                  </Popover.Trigger>
                  <Popover.Content placement="right">
                    <Popover.Dialog>
                      <div className="flex flex-col gap-2 w-52">
                        <button
                          type="button"
                          onClick={() => { setSelectedPalette(null); setPaletteOpen(false); }}
                          className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors ${
                            !selectedPalette ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
                          }`}
                        >
                          None
                          {!selectedPalette && <Check className="size-3" />}
                        </button>
                        <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
                          {(palettes as string[][]).map((palette, i) => {
                            const isActive = selectedPalette ? arraysEqual(selectedPalette, palette) : false;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => { setSelectedPalette(palette); setPaletteOpen(false); }}
                                className={`relative flex h-7 rounded-md overflow-hidden transition-shadow ${
                                  isActive ? "ring-2 ring-primary ring-offset-1 ring-offset-surface" : "hover:ring-1 hover:ring-border"
                                }`}
                              >
                                {palette.map((color) => (
                                  <div key={color} className="flex-1" style={{ backgroundColor: color }} />
                                ))}
                                {isActive && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Check className="size-3 text-white drop-shadow" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </Popover.Dialog>
                  </Popover.Content>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Custom</Label>
                  <p className="text-xs text-muted">Pick what to randomize</p>
                </div>
                <Switch isSelected={custom} onChange={setCustom}>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </div>

              {custom && (
                <>
                  <div className="h-px bg-border" />
                  {textMode ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Font Style</Label>
                        <Switch isSelected={randomizeFont} onChange={setRandomizeFont}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Font Color</Label>
                        <Switch isSelected={randomizeFontColor} onChange={setRandomizeFontColor}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Background Color</Label>
                        <Switch isSelected={randomizeBackground} onChange={setRandomizeBackground}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Icon</Label>
                        <Switch isSelected={randomizeIcon} onChange={setRandomizeIcon}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Icon Color</Label>
                        <Switch isSelected={randomizeIconColor} onChange={setRandomizeIconColor}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Background Color</Label>
                        <Switch isSelected={randomizeBackground} onChange={setRandomizeBackground}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                    </>
                  )}
                </>
              )}

              <Button
                size="sm"
                onPress={runRandomize}
                isDisabled={nothingSelected}
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
