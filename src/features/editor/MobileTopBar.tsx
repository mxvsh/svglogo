import { Button, Dropdown, Label } from "@heroui/react";
import { useState } from "react";
import { exportSvg } from "#/commands/export/export-svg";
import { exportPng } from "#/commands/export/export-png";
import { exportIco } from "#/commands/export/export-ico";
import { trackEvent } from "#/lib/analytics";
import { CrownDiamond } from "@gravity-ui/icons";
import { UserMenuButton } from "#/features/user-menu/UserMenuButton";
import { InfoModal } from "./InfoModal";

export function MobileTopBar() {
  const [infoOpen, setInfoOpen] = useState(false);

  const handleAction = (key: React.Key) => {
    if (key === "svg") void exportSvg();
    else if (key === "png") void exportPng();
    else if (key === "ico") void exportIco();
  };

  return (
    <>
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 pt-4 md:hidden">
      <button type="button" onClick={() => setInfoOpen(true)}>
        <img
          src="/logo512.png"
          alt="svglogo.dev"
          width={40}
          height={40}
          className="rounded-xl"
        />
      </button>
      <div className="flex items-center gap-2">
        <UserMenuButton />
        <a href="/creator" target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="ghost" onPress={() => trackEvent("creator card cta click")}>
              <CrownDiamond />
              Creator Plan
          </Button>
        </a>
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
    <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
