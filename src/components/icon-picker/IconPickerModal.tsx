import {
	Label,
	ListBox,
	Modal,
	SearchField,
	Select,
	Separator,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useIconSearch } from "#/hooks/useIconSearch";
import { useLogoStore } from "#/store/logoStore";
import { IconGrid } from "./IconGrid";

const ICON_SETS = [
	{ id: "lucide", label: "Lucide" },
	{ id: "heroicons", label: "Heroicons" },
	{ id: "ph", label: "Phosphor" },
	{ id: "ri", label: "Remix Icons" },
	{ id: "ion", label: "Ionicons" },
];

export function IconPickerModal() {
	const isOpen = useLogoStore((s) => s.iconPickerOpen);
	const closeIconPicker = useLogoStore((s) => s.closeIconPicker);
	const iconName = useLogoStore((s) => s.present.iconName);
	const set = useLogoStore((s) => s.set);

	const [query, setQuery] = useState("");
	const [prefix, setPrefix] = useState("lucide");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		const t = setTimeout(() => setDebouncedQuery(query), 300);
		return () => clearTimeout(t);
	}, [query]);

	const { data: icons = [], isFetching } = useIconSearch(
		debouncedQuery,
		prefix,
	);

	const handleSelect = (name: string) => {
		set((d) => {
			d.iconName = name;
		});
		closeIconPicker();
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) closeIconPicker();
			}}
		>
			<Modal.Backdrop isDismissable variant="transparent">
				<Modal.Container size="lg">
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading>Choose Icon</Modal.Heading>
							<Modal.CloseTrigger />
						</Modal.Header>

						<Modal.Body className="p-0 overflow-visible">
							<div className="flex gap-2 pt-3">
								<SearchField
									autoFocus
									variant="secondary"
									value={query}
									onChange={setQuery}
									className="flex-1"
									aria-label="Search icons"
								>
									<SearchField.Group>
										<SearchField.SearchIcon>
											<Icon icon="lucide:search" width={16} />
										</SearchField.SearchIcon>
										<SearchField.Input placeholder="Search icons…" />
										<SearchField.ClearButton />
									</SearchField.Group>
								</SearchField>

								<Select
									selectedKey={prefix}
									onSelectionChange={(key) => setPrefix(key as string)}
									className="w-44"
									aria-label="Icon set"
									variant="secondary"
								>
									<Select.Trigger>
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox>
											{ICON_SETS.map((s) => (
												<ListBox.Item key={s.id} id={s.id}>
													<Label>{s.label}</Label>
												</ListBox.Item>
											))}
										</ListBox>
									</Select.Popover>
								</Select>
							</div>

							<Separator
								className="my-4"
								orientation="horizontal"
								variant="secondary"
							/>

							<div className="px-3 py-1">
								<p className="text-xs text-muted">
									{isFetching ? "Loading…" : `${icons.length} icons`}
								</p>
							</div>

							<div className="h-[380px]">
								<IconGrid
									icons={icons}
									isLoading={isFetching && icons.length === 0}
									selected={iconName}
									onSelect={handleSelect}
								/>
							</div>
						</Modal.Body>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
