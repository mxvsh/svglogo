import {
	ColorArea,
	ColorPicker,
	ColorSlider,
	ColorSwatch,
	Label,
	Slider,
	Switch,
} from "@heroui/react";
import type { Color } from "react-aria-components";
import { useLogo } from "#/hooks/useLogo";
import type { GradientStop } from "#/store/logoStore";

function ColorSwatchPopover({
	value,
	onChange,
}: {
	value: string;
	onChange: (hex: string) => void;
}) {
	return (
		<ColorPicker
			value={value}
			onChange={(c: Color) => onChange(c.toString("hex"))}
		>
			<ColorPicker.Trigger>
				<ColorSwatch size="sm" shape="circle" />
			</ColorPicker.Trigger>
			<ColorPicker.Popover placement="top">
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

export function BgControl() {
	const { background, set } = useLogo();
	const isGradient = background.type === "gradient";

	const toggleGradient = (on: boolean) => {
		if (on) {
			set((d) => {
				d.background = {
					type: "gradient",
					direction: 135,
					stops: [
						{
							color: background.type === "solid" ? background.color : "#6366f1",
							position: 0,
						},
						{ color: "#a855f7", position: 100 },
					],
				};
			});
		} else {
			const color =
				background.type === "gradient" ? background.stops[0].color : "#6366f1";
			set((d) => {
				d.background = { type: "solid", color };
			});
		}
	};

	return (
		<div className="flex w-52 flex-col gap-4">
			<div className="flex items-center justify-between">
				<span className="text-xs text-muted">Gradient</span>
				<Switch isSelected={isGradient} onChange={toggleGradient}>
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
				</Switch>
			</div>

			{!isGradient && background.type === "solid" && (
				<div className="flex items-center justify-between gap-3">
					<span className="text-xs text-muted">Color</span>
					<ColorSwatchPopover
						value={background.color}
						onChange={(c) =>
							set((d) => {
								if (d.background.type === "solid") d.background.color = c;
							})
						}
					/>
				</div>
			)}

			{isGradient && background.type === "gradient" && (
				<GradientTab
					direction={background.direction}
					stops={background.stops}
					onDirection={(v) =>
						set((d) => {
							if (d.background.type === "gradient") d.background.direction = v;
						})
					}
					onStop={(i, stop) =>
						set((d) => {
							if (d.background.type === "gradient")
								d.background.stops[i] = stop;
						})
					}
				/>
			)}
		</div>
	);
}

function GradientTab({
	direction,
	stops,
	onDirection,
	onStop,
}: {
	direction: number;
	stops: [GradientStop, GradientStop];
	onDirection: (v: number) => void;
	onStop: (i: number, stop: GradientStop) => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<Slider
				value={direction}
				onChange={(v) => onDirection(v as number)}
				minValue={0}
				maxValue={360}
				step={1}
				aria-label="Gradient angle"
			>
				<div className="flex justify-between">
					<Label className="text-xs text-muted">Angle</Label>
					<Slider.Output className="text-xs text-muted">
						{() => `${direction}°`}
					</Slider.Output>
				</div>
				<Slider.Track>
					<Slider.Fill />
					<Slider.Thumb />
				</Slider.Track>
			</Slider>

			{stops.map((stop, i) => (
				<div
					key={`${stop.color}-${stop.position}`}
					className="flex items-center gap-3"
				>
					<span className="text-xs text-muted w-12 shrink-0">Stop {i + 1}</span>
					<ColorSwatchPopover
						value={stop.color}
						onChange={(c) => onStop(i, { ...stop, color: c })}
					/>
					<Slider
						value={stop.position}
						onChange={(v) => onStop(i, { ...stop, position: v as number })}
						minValue={0}
						maxValue={100}
						step={1}
						aria-label={`Stop ${i + 1} position`}
						className="flex-1"
						style={{ gridTemplateAreas: '"track track"', gap: 0 }}
					>
						<Slider.Track>
							<Slider.Fill />
							<Slider.Thumb />
						</Slider.Track>
					</Slider>
					<span className="text-xs text-muted w-8 text-right">
						{stop.position}%
					</span>
				</div>
			))}
		</div>
	);
}
