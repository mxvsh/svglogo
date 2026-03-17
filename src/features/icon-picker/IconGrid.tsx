import { Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const CELL = 56;

function useCols() {
  if (typeof window === "undefined") return 8;
  return window.innerWidth < 768 ? 6 : 8;
}

interface IconGridProps {
  icons: string[];
  isLoading: boolean;
  selected: string;
  onSelect: (icon: string) => void;
  query?: string;
  isGlobal ?: boolean;
  onGlobalSearch?: () => void;
}

export function IconGrid({
  icons,
  isLoading,
  selected,
  onSelect,
  query,
  isGlobalSearch,
  onGlobalSearch,
}: IconGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const COLS = useCols();
  const rowCount = Math.ceil(icons.length / COLS);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CELL,
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted">No icons found</p>
        {query && !isGlobalSearch && onGlobalSearch && (
          <Button size="sm" variant="outline" onPress={onGlobalSearch}>
            <Icon icon="lucide:globe" width={14} />
            Search all icon sets
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-2"
      style={{ contain: "size layout" }}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
          padding: "4px 0",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIdx = virtualRow.index * COLS;
          const rowIcons = icons.slice(startIdx, startIdx + COLS);
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: virtualRow.start,
                left: 0,
                width: "100%",
                height: CELL,
                display: "flex",
                justifyContent: "space-between",
                padding: "0 12px",
              }}
            >
              {rowIcons.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => onSelect(iconName)}
                  title={iconName}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                    selected === iconName
                      ? "bg-accent)/20 ring-2 ring-accent"
                      : "hover:bg-surface-secondary)"
                  }`}
                >
                  <Icon
                    icon={iconName}
                    width={24}
                    height={24}
                    className="text-foreground"
                  />
                </button>
              ))}
              {Array.from(
                { length: COLS - rowIcons.length },
                (_, slotOffset) => startIdx + rowIcons.length + slotOffset,
              ).map((emptySlotKey) => (
                <div
                  key={`empty-${emptySlotKey}`}
                  className="h-12 w-12 shrink-0"
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
