import { Label, Slider } from "@heroui/react";

interface SliderControlProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	unit?: string;
	onChange: (v: number) => void;
}

export function SliderControl({
	label,
	value,
	min,
	max,
	step = 1,
	unit = "",
	onChange,
}: SliderControlProps) {
	return (
		<div className="w-52">
			<Slider
				value={value}
				onChange={(v) => onChange(v as number)}
				minValue={min}
				maxValue={max}
				step={step}
			>
				<div className="flex justify-between">
					<Label className="text-xs text-muted">{label}</Label>
					<Slider.Output className="text-xs text-muted">
						{() => `${value}${unit}`}
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
