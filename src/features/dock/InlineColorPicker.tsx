import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  parseColor,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Color } from "react-aria-components";

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
];

interface InlineColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  placement?: "top" | "bottom" | "left" | "right";
  size?: "xs" | "sm" | "md" | "lg";
  title?: string;
}

export function InlineColorPicker({
  value,
  onChange,
  placement = "top",
  size = "sm",
}: InlineColorPickerProps) {
  const parsed = (() => {
    try {
      return parseColor(value);
    } catch {
      return parseColor("#000000");
    }
  })();

  const shuffle = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 50 + Math.floor(Math.random() * 50);
    const l = 40 + Math.floor(Math.random() * 30);
    onChange(parseColor(`hsl(${h}, ${s}%, ${l}%)`).toString("hex"));
  };

  return (
    <ColorPicker
      value={parsed}
      onChange={(c: Color) => onChange(c.toString("hex"))}
    >
      <ColorPicker.Trigger className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-default">
        <ColorSwatch size={size} shape="circle" color={value} />
      </ColorPicker.Trigger>
      <ColorPicker.Popover placement={placement} className="gap-2">
        <ColorSwatchPicker className="justify-center pt-2" size="xs">
          {PRESETS.map((p) => (
            <ColorSwatchPicker.Item key={p} color={p}>
              <ColorSwatchPicker.Swatch />
            </ColorSwatchPicker.Item>
          ))}
        </ColorSwatchPicker>
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          className="max-w-full"
        >
          <ColorArea.Thumb />
        </ColorArea>
        <div className="flex items-center gap-2 px-1">
          <ColorSlider channel="hue" colorSpace="hsb" className="flex-1">
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
          <Button
            isIconOnly
            size="sm"
            variant="tertiary"
            aria-label="Shuffle color"
            onPress={shuffle}
          >
            <Icon icon="gravity-ui:shuffle" className="size-4" />
          </Button>
        </div>
        <ColorField aria-label="Hex color">
          <ColorField.Group variant="secondary">
            <ColorField.Prefix>
              <ColorSwatch size="xs" />
            </ColorField.Prefix>
            <ColorField.Input
              className="uppercase"
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
            />
          </ColorField.Group>
        </ColorField>
      </ColorPicker.Popover>
    </ColorPicker>
  );
}
