import ArrowRotateLeft from "@gravity-ui/icons/ArrowRotateLeft";
import ArrowRotateRight from "@gravity-ui/icons/ArrowRotateRight";
import ArrowsExpand from "@gravity-ui/icons/ArrowsExpand";
import BucketPaint from "@gravity-ui/icons/BucketPaint";
import FaceSmile from "@gravity-ui/icons/FaceSmile";
import Frame from "@gravity-ui/icons/Frame";
import { Button, Label, Popover, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useLogoState, useLogoActions } from "#/queries/logo/use-logo-state";
import { useLogoStore } from "#/store/logo-store";
import { BgControl } from "./BgControl";
import { BorderControl } from "./BorderControl";
import { ExportMenu } from "./ExportMenu";
import { HistoryButton } from "./HistoryButton";
import { InlineColorPicker } from "./InlineColorPicker";
import { RandomizePopover } from "./RandomizePopover";
import { SliderControl } from "./SliderControl";

export function Dock() {
  const { set, undo, redo, canUndo, canRedo } = useLogoActions();
  const { iconColor, iconBorderColor, iconBorderWidth, iconSize, iconRotation } =
    useLogoState();
  const openIconPicker = useLogoStore((s) => s.openIconPicker);

  return (
    <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 max-w-[calc(100vw-1.5rem)] md:bottom-6 md:max-w-none">
      <div className="relative">
        <div className="hidden md:block absolute right-full top-1/2 mr-2 -translate-y-1/2">
          <RandomizePopover />
        </div>

        <div className="hidden md:block absolute left-full top-1/2 ml-2 -translate-y-1/2">
          <HistoryButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 72 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center rounded-2xl border border-border bg-surface/90 px-2 py-2 shadow-xl backdrop-blur-xl"
        >
          {/* Undo */}
          <Tooltip>
            <Tooltip.Trigger tabIndex={-1}>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                isDisabled={!canUndo()}
                onPress={undo}
                aria-label="Undo"
              >
                <ArrowRotateLeft width={16} height={16} />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p className="text-xs">Undo (⌘Z)</p>
            </Tooltip.Content>
          </Tooltip>

          {/* Desktop redo */}
          <div className="hidden md:contents">
            <Tooltip>
              <Tooltip.Trigger tabIndex={-1}>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  isDisabled={!canRedo()}
                  onPress={redo}
                  aria-label="Redo"
                >
                  <ArrowRotateRight width={16} height={16} />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">Redo (⌘⇧Z)</p>
              </Tooltip.Content>
            </Tooltip>
            <Divider />
          </div>

          {/* Scrollable middle section */}
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
            <div className="flex w-max items-center gap-2 px-1 md:w-auto md:px-0">
              {/* Change Icon */}
              <Tooltip>
                <Tooltip.Trigger tabIndex={-1}>
                  <Button
                    isIconOnly
                    variant="ghost"
                    onPress={openIconPicker}
                    aria-label="Change icon"
                    data-tour="icon-button"
                  >
                    <FaceSmile width={20} height={20} />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p className="text-xs">Change Icon</p>
                </Tooltip.Content>
              </Tooltip>

              {/* Icon Color */}
              <Tooltip>
                <Tooltip.Trigger tabIndex={-1}>
                  <InlineColorPicker
                    title="Icon Color"
                    size="xs"
                    value={iconColor}
                    onChange={(c) =>
                      set((d) => {
                        d.iconColor = c;
                      })
                    }
                  />
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p className="text-xs">Icon Color</p>
                </Tooltip.Content>
              </Tooltip>

              <DockPopover
                label="Icon Border"
                icon={<Icon icon="lucide:circle" width={16} height={16} />}
              >
                <div className="flex w-52 flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted">Color</Label>
                    <InlineColorPicker
                      title="Icon Border Color"
                      value={iconBorderColor}
                      onChange={(c) =>
                        set((d) => {
                          d.iconBorderColor = c;
                        })
                      }
                    />
                  </div>
                  <SliderControl
                    label="Width"
                    value={iconBorderWidth}
                    min={0}
                    max={24}
                    unit="px"
                    onChange={(v) =>
                      set((d) => {
                        d.iconBorderWidth = v;
                      })
                    }
                  />
                </div>
              </DockPopover>

              <Divider />

              <DockPopover
                label="Background"
                tourId="background-button"
                icon={<BucketPaint width={16} height={16} />}
              >
                <BgControl />
              </DockPopover>

              <DockPopover
                label="Border & Radius"
                tourId="border-radius-button"
                icon={<Frame width={16} height={16} />}
              >
                <BorderControl />
              </DockPopover>

              <DockPopover
                label="Icon Transform"
                icon={<ArrowsExpand width={16} height={16} />}
              >
                <div className="flex w-52 flex-col gap-4">
                  <SliderControl
                    label="Rotate"
                    value={iconRotation}
                    min={0}
                    max={360}
                    unit="°"
                    onChange={(v) =>
                      set((d) => {
                        d.iconRotation = v;
                      })
                    }
                  />
                  <SliderControl
                    label="Size"
                    value={iconSize}
                    min={10}
                    max={90}
                    unit="%"
                    onChange={(v) =>
                      set((d) => {
                        d.iconSize = v;
                      })
                    }
                  />
                </div>
              </DockPopover>

              <div className="hidden md:contents">
                <Divider />
                <ExportMenu />
              </div>
            </div>
          </div>

          {/* Redo — right anchor (mobile only) */}
          <div className="md:hidden">
            <Tooltip>
              <Tooltip.Trigger tabIndex={-1}>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  isDisabled={!canRedo()}
                  onPress={redo}
                  aria-label="Redo"
                >
                  <ArrowRotateRight width={16} height={16} />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">Redo</p>
              </Tooltip.Content>
            </Tooltip>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-5 w-px bg-border mx-1" />;
}

function DockPopover({
  label,
  tourId,
  icon,
  children,
}: {
  label: string;
  tourId?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <Tooltip>
        <Tooltip.Trigger tabIndex={-1}>
          <Popover.Trigger tabIndex={-1}>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              aria-label={label}
              data-tour={tourId}
            >
              {icon}
            </Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p className="text-xs">{label}</p>
        </Tooltip.Content>
      </Tooltip>
      <Popover.Content placement="top">
        <Popover.Dialog>{children}</Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
