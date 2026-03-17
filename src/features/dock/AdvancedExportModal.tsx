import { Button, Checkbox, Description, Label, Modal, Separator, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { EXPORT_PLATFORMS } from "#/data/export-platforms";
import { exportAppIcons } from "#/commands/export/export-app-icons";

interface AdvancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPLE_PLATFORMS = ["ios", "macos"];

export function AdvancedExportModal({ isOpen, onClose }: AdvancedExportModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["ios", "android", "web"]);
  const [squareCorners, setSquareCorners] = useState(true);
  const [includeContentsJson, setIncludeContentsJson] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const hasApplePlatform = selectedPlatforms.some((p) => APPLE_PLATFORMS.includes(p));

  const totalFiles = EXPORT_PLATFORMS.filter((p) =>
    selectedPlatforms.includes(p.id),
  ).reduce((sum, p) => sum + p.sizes.length + (includeContentsJson && APPLE_PLATFORMS.includes(p.id) ? 1 : 0), 0);

  const handleExport = async () => {
    if (selectedPlatforms.length === 0) return;
    setIsExporting(true);
    try {
      await exportAppIcons({ platforms: selectedPlatforms, squareCorners, includeContentsJson });
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Advanced Export</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-5">
              {/* Platforms */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted">Platforms</p>
                <div className="flex flex-col gap-2">
                  {EXPORT_PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-accent/40 bg-accent/5"
                          : "border-border hover:border-border/80 hover:bg-surface-secondary"
                      }`}
                    >
                      <Checkbox
                        isSelected={selectedPlatforms.includes(platform.id)}
                        onChange={() => togglePlatform(platform.id)}
                        aria-label={platform.label}
                      >
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox>
                      <Icon icon={platform.icon} width={16} height={16} className="text-muted shrink-0" />
                      <div className="flex flex-col flex-1">
                        <Label>{platform.label}</Label>
                        <Description>{platform.description}</Description>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator orientation="horizontal" variant="secondary" />

              {/* Options */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted">Options</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label className="text-sm">Square corners</Label>
                    <span className="text-xs text-muted">Platforms apply their own mask</span>
                  </div>
                  <Switch isSelected={squareCorners} onChange={setSquareCorners}>
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch>
                </div>

                <div className={`flex items-center justify-between transition-opacity ${!hasApplePlatform ? "opacity-40 pointer-events-none" : ""}`}>
                  <div className="flex flex-col">
                    <Label className="text-sm">Include Contents.json</Label>
                    <span className="text-xs text-muted">Xcode compatibility (iOS & macOS)</span>
                  </div>
                  <Switch isSelected={includeContentsJson} onChange={setIncludeContentsJson} isDisabled={!hasApplePlatform}>
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-between">
              <span className="text-xs text-muted">
                {selectedPlatforms.length === 0
                  ? "No platforms selected"
                  : `${totalFiles} files across ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""}`}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" onPress={onClose}>Cancel</Button>
                <Button
                  variant="primary"
                  onPress={handleExport}
                  isDisabled={selectedPlatforms.length === 0 || isExporting}
                  isLoading={isExporting}
                >
                  Export ZIP
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
