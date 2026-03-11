import ArrowRotateLeft from "@gravity-ui/icons/ArrowRotateLeft";
import ArrowRotateRight from "@gravity-ui/icons/ArrowRotateRight";
import ArrowsExpand from "@gravity-ui/icons/ArrowsExpand";
import BucketPaint from "@gravity-ui/icons/BucketPaint";
import FaceSmile from "@gravity-ui/icons/FaceSmile";
import Frame from "@gravity-ui/icons/Frame";
import { Button, Label, Popover, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useLogo } from "#/hooks/useLogo";
import { getRandomLogoVisual } from "#/lib/randomizeLogo";
import { useLogoStore } from "#/store/logoStore";
import { BgControl } from "./BgControl";
import { BorderControl } from "./BorderControl";
import { ExportMenu } from "./ExportMenu";
import { InlineColorPicker } from "./InlineColorPicker";
import { SliderControl } from "./SliderControl";

export function Dock() {
	const {
		undo,
		redo,
		canUndo,
		canRedo,
		iconColor,
		iconBorderColor,
		iconBorderWidth,
		iconSize,
		set,
	} = useLogo();
	const openIconPicker = useLogoStore((s) => s.openIconPicker);
	const randomizeVisual = () => {
		const next = getRandomLogoVisual();
		set((d) => {
			d.iconName = next.iconName;
			d.iconColor = next.iconColor;
			d.background = next.background;
		});
	};

	// const saveCombination = () => {
	// 	const storageKey = "svglogo-saved-combinations";
	// 	const raw = window.localStorage.getItem(storageKey);
	// 	const parsed = raw ? JSON.parse(raw) : [];
	// 	const current = Array.isArray(parsed) ? parsed : [];
	// 	const next = [
	// 		{
	// 			iconName,
	// 			iconColor,
	// 			background,
	// 			savedAt: Date.now(),
	// 		},
	// 		...current,
	// 	];
	// 	window.localStorage.setItem(storageKey, JSON.stringify(next));
	// };

	return (
		<div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
			<div className="relative">
				<div className="absolute right-full top-1/2 mr-2 -translate-y-1/2">
					<motion.div
						initial={{ opacity: 0, y: 72 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
						className="flex items-center rounded-2xl border border-(--border) bg-(--surface)/90 px-2 py-2 shadow-xl backdrop-blur-xl"
					>
						<Tooltip>
							<Tooltip.Trigger>
								<Button
									isIconOnly
									variant="ghost"
									onPress={randomizeVisual}
									aria-label="Randomize icon, color and background"
								>
									<Icon icon="lucide:dice-5" width={16} height={16} />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p className="text-xs">Randomize</p>
							</Tooltip.Content>
						</Tooltip>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 72 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
					className="flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface)/90 px-3 py-2 shadow-xl backdrop-blur-xl"
				>
					{/* Undo / Redo */}
					<Tooltip>
						<Tooltip.Trigger>
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

					<Tooltip>
						<Tooltip.Trigger>
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

					{/* Change Icon */}
					<Tooltip>
						<Tooltip.Trigger>
							<Button
								isIconOnly
								variant="ghost"
								onPress={openIconPicker}
								aria-label="Change icon"
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
						<Tooltip.Trigger>
              <InlineColorPicker
                
                size='xs'
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
						icon={<BucketPaint width={16} height={16} />}
					>
						<BgControl />
					</DockPopover>

					<DockPopover
						label="Border & Radius"
						icon={<Frame width={16} height={16} />}
					>
						<BorderControl />
					</DockPopover>

					<DockPopover
						label="Icon Size"
						icon={<ArrowsExpand width={16} height={16} />}
					>
						<SliderControl
							label="Icon Size"
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
					</DockPopover>
				</motion.div>

				<div className="absolute left-full top-1/2 ml-2 -translate-y-1/2">
					<motion.div
						initial={{ opacity: 0, y: 72 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: 0.12,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="flex items-center rounded-2xl border border-(--border) bg-(--surface)/90 px-2 py-2 shadow-xl backdrop-blur-xl"
					>
						<ExportMenu />
					</motion.div>
				</div>
			</div>
		</div>
	);
}

function Divider() {
	return <div className="h-5 w-px bg-(--border) mx-1" />;
}

function DockPopover({
	label,
	icon,
	children,
}: {
	label: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Popover>
			<Tooltip>
				<Tooltip.Trigger>
					<Popover.Trigger>
						<Button isIconOnly variant="ghost" size="sm" aria-label={label}>
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
