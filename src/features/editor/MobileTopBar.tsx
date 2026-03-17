import { Button, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAnimate } from "framer-motion";
import { exportSvg } from "#/commands/export/export-svg";
import { exportPng } from "#/commands/export/export-png";
import { exportIco } from "#/commands/export/export-ico";
import { randomizeLogo } from "#/commands/logo/randomize-logo";
import { trackEvent } from "#/lib/analytics";

export function MobileTopBar() {
  const [scope, animate] = useAnimate();

  const handleAction = (key: React.Key) => {
    if (key === "svg") void exportSvg();
    else if (key === "png") void exportPng();
    else if (key === "ico") void exportIco();
  };

  const handleRandomize = async () => {
    void animate(
      scope.current,
      { rotate: [0, 360] },
      { duration: 0.35, ease: "easeOut" },
    );
    await randomizeLogo({ icon: true, background: true });
    trackEvent("randomize logo", { icon: true, background: true });
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 pt-4 md:hidden">
      <img
        src="/logo512.png"
        alt="svglogo.dev"
        width={40}
        height={40}
        className="rounded-xl"
      />
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label="Randomize"
          onPress={() => void handleRandomize()}
        >
          <span ref={scope} style={{ display: "inline-flex" }}>
            <Icon icon="lucide:dice-5" width={16} height={16} />
          </span>
        </Button>
        <Dropdown>
          <Button size="sm" variant="primary" aria-label="Export">
            Export
          </Button>
          <Dropdown.Popover placement="bottom start" className="w-52">
            <Dropdown.Menu onAction={handleAction}>
              <Dropdown.Item id="svg">
                <Label>SVG</Label>
              </Dropdown.Item>
              <Dropdown.Item id="png">
                <Label>PNG</Label>
              </Dropdown.Item>
              <Dropdown.Item id="ico">
                <Label>ICO (48px)</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
}
