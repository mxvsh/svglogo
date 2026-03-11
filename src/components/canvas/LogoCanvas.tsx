import { Icon } from "@iconify/react";
import { buildBackgroundCss } from "#/lib/canvasUtils";
import { getPreviewOutlineFilter } from "#/lib/iconOutline";
import { useLogoStore } from "#/store/logoStore";

export function LogoCanvas() {
	const {
		iconName,
		iconColor,
		iconBorderColor,
		iconBorderWidth,
		iconSize,
		background,
		borderRadius,
		borderWidth,
		borderColor,
	} = useLogoStore((s) => s.present);

	const bgStyle = buildBackgroundCss(background);
	const safeIconSize = Number.isFinite(iconSize)
		? Math.min(90, Math.max(10, iconSize))
		: 60;
	const safeIconBorderWidth = Number.isFinite(iconBorderWidth)
		? Math.min(24, Math.max(0, iconBorderWidth))
		: 0;
	const iconPx = Math.round((safeIconSize / 100) * 512);
	const iconOutlineFilter = getPreviewOutlineFilter(
		safeIconBorderWidth,
		iconBorderColor,
	);

	return (
		<div
			className="relative shrink-0 shadow-2xl shadow-black/50"
			style={{
				width: 512,
				height: 512,
				borderRadius,
				overflow: "hidden",
				...bgStyle,
				...(borderWidth > 0
					? {
							boxShadow: `inset 0 0 0 ${borderWidth}px ${borderColor}, 0 32px 64px rgba(0,0,0,0.5)`,
						}
					: { boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }),
			}}
		>
			<div className="relative flex h-full w-full items-center justify-center">
				<Icon
					icon={iconName}
					width={iconPx}
					height={iconPx}
					color={iconColor}
					style={{
						display: "block",
						flexShrink: 0,
						filter: iconOutlineFilter,
						WebkitFilter: iconOutlineFilter,
					}}
				/>
			</div>
		</div>
	);
}
