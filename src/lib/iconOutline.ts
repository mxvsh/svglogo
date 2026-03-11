export interface IconOutlineOffset {
	x: number;
	y: number;
}

export function getIconOutlineOffsets(width: number): IconOutlineOffset[] {
	const safeWidth = Number.isFinite(width) ? width : 0;
	const w = Math.min(24, Math.max(0, Math.round(safeWidth)));
	if (w <= 0) return [];

	const rings = Array.from(
		new Set([
			w,
			Math.max(1, Math.round(w * 0.66)),
			Math.max(1, Math.round(w * 0.33)),
		]),
	);

	const offsetSet = new Set<string>();
	for (const radius of rings) {
		const steps = Math.max(12, Math.round((2 * Math.PI * radius) / 3));
		for (let i = 0; i < steps; i++) {
			const angle = (i / steps) * Math.PI * 2;
			const x = Math.round(Math.cos(angle) * radius);
			const y = Math.round(Math.sin(angle) * radius);
			offsetSet.add(`${x},${y}`);
		}
	}

	offsetSet.delete("0,0");

	return Array.from(offsetSet, (key) => {
		const [x, y] = key.split(",").map(Number);
		return { x, y };
	});
}

export function getPreviewOutlineFilter(
	width: number,
	color: string,
): string | undefined {
	const safeWidth = Number.isFinite(width) ? width : 0;
	const w = Math.min(24, Math.max(0, Math.round(safeWidth)));
	if (w <= 0) return undefined;

	// Keep preview filter lightweight to avoid GPU stalls while dragging.
	const radii = w <= 2 ? [w] : [Math.max(1, Math.round(w * 0.55)), w];
	const steps = 12;
	const offsetSet = new Set<string>();

	for (const radius of radii) {
		for (let i = 0; i < steps; i++) {
			const angle = (i / steps) * Math.PI * 2;
			const x = Math.round(Math.cos(angle) * radius);
			const y = Math.round(Math.sin(angle) * radius);
			offsetSet.add(`${x},${y}`);
		}
	}

	offsetSet.delete("0,0");

	return Array.from(offsetSet)
		.map((key) => {
			const [x, y] = key.split(",").map(Number);
			return `drop-shadow(${x}px ${y}px 0 ${color})`;
		})
		.join(" ");
}
