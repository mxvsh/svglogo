import { Label, Slider } from "@heroui/react";
import { useLogo } from "#/hooks/useLogo";
import { InlineColorPicker } from "./InlineColorPicker";

export function BorderControl() {
	const { borderWidth, borderColor, borderRadius, set } = useLogo();

	return (
		<div className="flex w-52 flex-col gap-4">
			<Slider
				value={borderWidth}
				onChange={(v) =>
					set((d) => {
						d.borderWidth = v as number;
					})
				}
				minValue={0}
				maxValue={24}
				step={1}
			>
				<div className="flex justify-between">
					<Label className="text-xs text-muted">Border Width</Label>
					<Slider.Output className="text-xs text-muted">
						{() => `${borderWidth}px`}
					</Slider.Output>
				</div>
				<Slider.Track>
					<Slider.Fill />
					<Slider.Thumb />
				</Slider.Track>
			</Slider>

			{borderWidth > 0 && (
				<div className="flex items-center justify-between gap-3">
					<Label className="text-xs text-muted">Color</Label>
					<InlineColorPicker
						value={borderColor}
						onChange={(c) =>
							set((d) => {
								d.borderColor = c;
							})
						}
					/>
				</div>
			)}

			<Slider
				value={borderRadius}
				onChange={(v) =>
					set((d) => {
						d.borderRadius = v as number;
					})
				}
				minValue={0}
				maxValue={256}
				step={1}
			>
				<div className="flex justify-between">
					<Label className="text-xs text-muted">Radius</Label>
					<Slider.Output className="text-xs text-muted">
						{() => `${borderRadius}px`}
					</Slider.Output>
				</div>
				<Slider.Track>
					<Slider.Fill />
					<Slider.Thumb />
				</Slider.Track>
			</Slider>
		</div>
	);
}
