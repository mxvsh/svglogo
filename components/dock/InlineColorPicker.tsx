import {
  ColorArea,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
} from "@heroui/react";
import type { Color } from "react-aria-components";

interface InlineColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  placement?: "top" | "bottom" | "left" | "right";
  size?: "xs" | "sm" | "md" | "lg";
  staticColor?: boolean;
}

export function InlineColorPicker({
  value,
  onChange,
  placement = "top",
  size = "sm",
  // staticColor,
}: InlineColorPickerProps) {
  return (
    <ColorPicker
      value={value}
      onChange={(c: Color) => onChange(c.toString("hex"))}
    >
      <ColorPicker.Trigger className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-default">
        <ColorSwatch size={size} shape="circle" color={value} />
      </ColorPicker.Trigger>
      <ColorPicker.Popover placement={placement} className="p-3">
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          className="max-w-full"
        >
          <ColorArea.Thumb />
        </ColorArea>
        <ColorSlider channel="hue" colorSpace="hsb" className="px-1 mt-2">
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider>
      </ColorPicker.Popover>
    </ColorPicker>
  );
}
