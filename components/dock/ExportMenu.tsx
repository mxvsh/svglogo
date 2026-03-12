import { Button, Dropdown, Label } from "@heroui/react";
import { useExport } from "#/hooks/useExport";

export function ExportMenu() {
  const { exportSvg, exportPng, exportIco } = useExport();

  const handleAction = (key: React.Key) => {
    if (key === "svg") exportSvg();
    else if (key === "png") exportPng();
    else if (key === "ico") exportIco();
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
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
