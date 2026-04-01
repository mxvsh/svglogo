import {
  Button,
  Label,
  ListBox,
  Modal,
  SearchField,
  Select,
  Separator,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ICON_SETS } from "#/domain/icon/icon.types";
import { selectIcon } from "#/commands/icon/select-icon";
import { openAuthModal } from "#/commands/ui/open-auth-modal";
import { trackEvent } from "#/lib/analytics";
import { useIconSearch } from "#/queries/icon/use-icon-search";
import { useGlobalIconSearch } from "#/queries/icon/use-global-icon-search";
import { useSession } from "#/queries/auth/use-session";
import { useLogoStore } from "#/store/logo-store";
import { searchIconsByCategoryFn } from "#/server/icons.search";
import { IconGrid } from "./IconGrid";

export function IconPickerModal() {
  const isOpen = useLogoStore((s) => s.iconPickerOpen);
  const closeIconPicker = useLogoStore((s) => s.closeIconPicker);
  const iconName = useLogoStore((s) => s.present.iconName);
  const prefix = useLogoStore((s) => s.selectedIconPrefix);
  const setSelectedIconPrefix = useLogoStore((s) => s.setSelectedIconPrefix);
  const { data: session } = useSession();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState(""); // only updates on explicit search

  useEffect(() => {
    if (aiMode) return;
    setIsGlobalSearch(false);
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query, aiMode]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery(""); setDebouncedQuery(""); setAiQuery(""); setAiMode(false);
      setIsGlobalSearch(false);
    }
  }, [isOpen]);

  const { data: prefixIcons = [], isFetching: isFetchingPrefix } =
    useIconSearch(debouncedQuery, prefix);

  const { data: globalIcons = [], isFetching: isFetchingGlobal } =
    useGlobalIconSearch(debouncedQuery, isGlobalSearch);

  const { data: aiResult, isFetching: isFetchingAi } = useQuery({
    queryKey: ["ai-icon-search", aiQuery, prefix],
    queryFn: () =>
      searchIconsByCategoryFn({
        data: { query: aiQuery },
      }),
    enabled: aiMode && !!aiQuery,
    staleTime: 0,
    gcTime: 0,
  });

  const aiIcons = aiResult?.icons ?? [];

  const icons = aiMode
    ? aiIcons
    : isGlobalSearch
      ? globalIcons
      : prefixIcons;

  const isFetching = aiMode
    ? isFetchingAi
    : isGlobalSearch
      ? isFetchingGlobal
      : isFetchingPrefix;

  const handleSelect = (name: string) => {
    selectIcon(name);
  };

  function toggleAiMode() {
    if (!aiMode && !session) { openAuthModal(); return; }
    const next = !aiMode;
    setAiMode(next);
    setDebouncedQuery(""); setAiQuery("");
    trackEvent("ai search toggle", { enabled: next });
  }

  function handleAiSearch() {
    if (!query.trim()) return;
    setAiQuery(query.trim());
    trackEvent("ai search", { query: query.trim() });
  }

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
              <div className="flex items-center gap-2 pt-3 px-3">
                <SearchField
                  autoFocus={
                    typeof window !== "undefined" && window.innerWidth >= 768
                  }
                  variant="secondary"
                  value={query}
                  onChange={setQuery}
                  onKeyDown={(e) => { if (aiMode && e.key === "Enter") handleAiSearch(); }}
                  className="flex-1 min-w-0"
                  aria-label="Search icons"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon>
                      <Icon icon="lucide:search" width={16} />
                    </SearchField.SearchIcon>
                    <SearchField.Input
                      placeholder={aiMode ? "Describe icons (e.g. food, travel...)" : "Search icons..."}
                    />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>

                {aiMode && (
                  <Button
                    variant="primary"
                    onPress={handleAiSearch}
                    isPending={isFetchingAi}
                    isDisabled={!query.trim()}
                    className="shrink-0"
                  >
                    Search
                  </Button>
                )}

                {!aiMode && (
                  <Select
                    selectedKey={prefix}
                    onSelectionChange={(key) => {
                      setSelectedIconPrefix(key as string);
                    }}
                    className="w-32 md:w-40 shrink-0"
                    aria-label="Icon set"
                    variant="secondary"
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover placement="bottom end" shouldFlip>
                      <ListBox>
                        {ICON_SETS.map((s) => (
                          <ListBox.Item key={s.id} id={s.id}>
                            <Label>{s.label}</Label>
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}

                <Tooltip delay={0} placement="bottom">
                  <Tooltip.Trigger>
                    <button
                      type="button"
                      onClick={toggleAiMode}
                      className={`flex shrink-0 items-center justify-center rounded-lg border p-2 transition-colors ${
                        aiMode
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted hover:text-foreground"
                      }`}
                      aria-label="Toggle AI search"
                    >
                      <Icon icon="lucide:sparkles" width={16} />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p className="text-xs">{aiMode ? "AI search on" : "AI search"}</p>
                  </Tooltip.Content>
                </Tooltip>
              </div>

              {aiMode && aiResult?.error && (
                <p className="px-3 pt-2 text-xs text-danger">{aiResult.error}</p>
              )}

              <Separator className="my-4" orientation="horizontal" variant="secondary" />

              <div className="px-3 py-1">
                <p className="text-xs text-muted">
                  {isFetching
                    ? "Loading..."
                    : aiMode
                      ? aiQuery
                        ? `${aiIcons.length} icons`
                        : "Type and press Search"
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
                  onGlobalSearch={aiMode ? undefined : () => setIsGlobalSearch(true)}
                />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
