import { Button, Dropdown, Label, Separator, toast } from "@heroui/react";
import { useState } from "react";
import { exportSvg } from "#/commands/export/export-svg";
import { exportPng } from "#/commands/export/export-png";
import { exportIco } from "#/commands/export/export-ico";
import { copySvg } from "#/commands/export/copy-svg";
import { copyPng } from "#/commands/export/copy-png";
import { AdvancedExportModal } from "./AdvancedExportModal";
import { BrandKitModal } from "./BrandKitModal";
import { useAuth } from "#/queries/auth/use-auth";

export function ExportMenu() {
  const user = useAuth();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);

  const isCreator = user?.plan === "creator";

  const handleAction = (key: React.Key) => {
    if (key === "svg") void exportSvg();
    else if (key === "png") void exportPng();
    else if (key === "ico") void exportIco();
    else if (key === "copy-svg") copySvg().then((ok) => toast(ok ? "SVG copied" : "Copy failed"));
    else if (key === "copy-png") copyPng().then((ok) => toast(ok ? "PNG copied" : "Copy failed"));
    else if (key === "advanced") setAdvancedOpen(true);
    else if (key === "brand-kit") setBrandKitOpen(true);
  };

  return (
    <>
      <Dropdown>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Export"
          data-tour="export-button"
        >
          Export
        </Button>
        <Dropdown.Popover placement="top end">
          <Dropdown.Menu onAction={handleAction}>
            <Dropdown.Item id="svg">
              <Label>Download SVG</Label>
            </Dropdown.Item>
            <Dropdown.Item id="png">
              <Label>Download PNG</Label>
            </Dropdown.Item>
            <Dropdown.Item id="ico">
              <Label>Download ICO (48px)</Label>
            </Dropdown.Item>
            <Separator />
            <Dropdown.Item id="copy-svg">
              <Label>Copy SVG</Label>
            </Dropdown.Item>
            <Dropdown.Item id="copy-png">
              <Label>Copy PNG</Label>
            </Dropdown.Item>
            <Separator />
            <Dropdown.Item id="advanced">
              <Label>Advanced export…</Label>
            </Dropdown.Item>
            {isCreator && (
              <Dropdown.Item id="brand-kit">
                <Label>Brand kit…</Label>
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <AdvancedExportModal
        isOpen={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
      />
      {isCreator && (
        <BrandKitModal
          isOpen={brandKitOpen}
          onClose={() => setBrandKitOpen(false)}
        />
      )}
    </>
  );
}
