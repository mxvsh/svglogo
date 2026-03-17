import { Button, Dropdown, Label, Separator } from "@heroui/react";
import { exportSvg } from "#/commands/export/export-svg";
import { exportPng } from "#/commands/export/export-png";
import { exportIco } from "#/commands/export/export-ico";
import { copySvg } from "#/commands/export/copy-svg";
import { copyPng } from "#/commands/export/copy-png";

export function ExportMenu() {
  const handleAction = (key: React.Key) => {
    if (key === "svg") void exportSvg();
    else if (key === "png") void exportPng();
    else if (key === "ico") void exportIco();
    else if (key === "copy-svg") void copySvg();
    else if (key === "copy-png") void copyPng();
  };

  return (
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
            <Label>SVG</Label>
          </Dropdown.Item>
          <Dropdown.Item id="png">
            <Label>PNG</Label>
          </Dropdown.Item>
          <Dropdown.Item id="ico">
            <Label>ICO (48px)</Label>
          </Dropdown.Item>
          <Separator />
          <Dropdown.Item id="copy-svg">
            <Label>Copy SVG</Label>
          </Dropdown.Item>
          <Dropdown.Item id="copy-png">
            <Label>Copy PNG</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
