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
import { useQuery } from "@tanstack/react-query";
import { fetchGlobalSearch, useIconSearch } from "#/hooks/useIconSearch";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logoStore";
import { IconGrid } from "./IconGrid";

const ICON_SETS = [
  { id: "lucide", label: "Lucide" },
  { id: "hugeicons", label: "Hugeicons" },
  { id: "heroicons", label: "Heroicons" },
  { id: "ph", label: "Phosphor" },
  { id: "ri", label: "Remix Icons" },
  { id: "ion", label: "Ionicons" },
];

export function IconPickerModal() {
  const isOpen = useLogoStore((s) => s.iconPickerOpen);
  const closeIconPicker = useLogoStore((s) => s.closeIconPicker);
  const iconName = useLogoStore((s) => s.present.iconName);
  const prefix = useLogoStore((s) => s.selectedIconPrefix);
  const setSelectedIconPrefix = useLogoStore((s) => s.setSelectedIconPrefix);
  const set = useLogoStore((s) => s.set);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);

  useEffect(() => {
    setIsGlobalSearch(false);
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: prefixIcons = [], isFetching: isFetchingPrefix } = useIconSearch(
    debouncedQuery,
    prefix,
  );

  const { data: globalIcons = [], isFetching: isFetchingGlobal } = useQuery({
    queryKey: ["iconify-global-search", debouncedQuery],
    queryFn: () => fetchGlobalSearch(debouncedQuery),
    enabled: isGlobalSearch && !!debouncedQuery,
    staleTime: 1000 * 60 * 5,
  });

  const icons = isGlobalSearch ? globalIcons : prefixIcons;
  const isFetching = isGlobalSearch ? isFetchingGlobal : isFetchingPrefix;

  const handleSelect = (name: string) => {
    trackEvent("select icon", { iconName: name });
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
                  autoFocus={
                    typeof window !== "undefined" && window.innerWidth >= 768
                  }
                  variant="secondary"
                  value={query}
                  onChange={setQuery}
                  className="flex-1 max-w-48 md:max-w-120"
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

                <div className="flex-1 md:flex-auto" />

                <Select
                  selectedKey={prefix}
                  onSelectionChange={(key) =>
                    setSelectedIconPrefix(key as string)
                  }
                  className="min-w-32 md:w-40"
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
                  {isFetching
                    ? "Loading…"
                    : isGlobalSearch
                      ? `${icons.length} icons across all sets`
                      : `${icons.length} icons`}
                </p>
              </div>

              <div className="h-95">
                <IconGrid
                  icons={icons}
                  isLoading={isFetching && icons.length === 0}
                  selected={iconName}
                  onSelect={handleSelect}
                  query={debouncedQuery}
                  isGlobalSearch={isGlobalSearch}
                  onGlobalSearch={() => setIsGlobalSearch(true)}
                />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
