import { BookOpen } from "@gravity-ui/icons";
import { Button, Description, Label, ListBox, Popover } from "@heroui/react";
import { format } from "timeago.js";
import { Icon } from "@iconify/react";
import { loadLogoFromState } from "#/commands/logo/load-logo";
import { removeFromCollection } from "#/commands/collection/remove-from-collection";
import { useCollections } from "#/queries/collection/use-collections";

export function CollectionsButton() {
  const collections = useCollections();

  const handleSelect = (id: React.Key) => {
    const saved = collections.find((l) => l.id === id);
    if (saved) {
      loadLogoFromState(saved);
    }
  };

  return (
    <div className="pointer-events-auto">
      <Popover>
        <Popover.Trigger>
          <Button size="lg">
            <BookOpen />
            Collections
          </Button>
        </Popover.Trigger>
        <Popover.Content className="p-1">
          <Popover.Dialog className="p-0">
            {collections.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center w-55">
                No saved logos yet.
              </div>
            ) : (
              <ListBox
                aria-label="Collections"
                className="w-65 max-h-72 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                selectionMode="single"
                onAction={handleSelect}
              >
                {collections.map((logo) => (
                  <ListBox.Item
                    key={logo.id}
                    id={logo.id}
                    textValue={logo.iconName}
                    className="group"
                  >
                    <div className="flex items-center gap-3 w-full py-1">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center border border-border/50 shrink-0"
                        style={{
                          background:
                            logo.background.type === "solid"
                              ? logo.background.color
                              : `linear-gradient(${logo.background.direction}deg, ${logo.background.stops[0].color}, ${logo.background.stops[1].color})`,
                        }}
                      >
                        <Icon
                          icon={logo.iconName}
                          width={18}
                          height={18}
                          style={{ color: logo.iconColor }}
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <Label className="truncate text-xs font-medium">
                          {logo.iconName.split(":")[1] || logo.iconName}
                        </Label>
                        <Description className="text-[10px] opacity-70">
                          <time
                            dateTime={new Date(logo.savedAt).toISOString()}
                            title={new Date(logo.savedAt).toLocaleString()}
                          >
                            {format(logo.savedAt)}
                          </time>
                        </Description>
                      </div>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity min-w-6 w-6 h-6 p-0 flex items-center justify-center ml-2"
                        onPress={() => {
                          removeFromCollection(logo.id);
                        }}
                      >
                        <Icon icon="lucide:x" width={12} height={12} />
                      </Button>
                    </div>
                  </ListBox.Item>
                ))}
              </ListBox>
            )}
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}
