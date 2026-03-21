import { Button, Input, Label, Modal, Separator, Tabs, TextField } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SOCIAL_ASSETS } from "#/data/social-assets";
import { STYLE_PRESETS, LAYOUT_PRESETS, PREVIEW_ASSET_IDS, PREVIEW_TAB_LABELS } from "#/data/brand-kit-presets";
import { exportBrandKit } from "#/commands/export/export-brand-kit";
import { useBrandKitPreview } from "#/queries/brand-kit/use-brand-kit-preview";
import { useLogoState } from "#/queries/logo/use-logo-state";
import type { BrandKitStyle, BrandKitLayout } from "#/domain/brand-kit/brand-kit.types";

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_ASSETS = SOCIAL_ASSETS.filter((a) =>
  (PREVIEW_ASSET_IDS as readonly string[]).includes(a.id),
);

export function BrandKitModal({ isOpen, onClose }: BrandKitModalProps) {
  const present = useLogoState();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [style, setStyle] = useState<BrandKitStyle>("minimal");
  const [layout, setLayout] = useState<BrandKitLayout>("centered");
  const [activeTab, setActiveTab] = useState<string>("og");
  const [isExporting, setIsExporting] = useState(false);
  const initializedRef = useRef(false);

  // Initialize title from logoText when modal opens
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      setTitle(present.logoText || "");
      initializedRef.current = true;
    }
    if (!isOpen) {
      initializedRef.current = false;
    }
  }, [isOpen, present.logoText]);

  const activeAsset = PREVIEW_ASSETS.find((a) => a.id === activeTab) ?? PREVIEW_ASSETS[0];

  const previewSvg = useBrandKitPreview({
    asset: activeAsset,
    title,
    tagline,
    style,
    layout,
    enabled: isOpen,
  });


  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportBrandKit({
        socialAssets: SOCIAL_ASSETS.map((a) => a.id),
        includeSvg: true,
        includePng: true,
        includeLogo: true,
        title: title || undefined,
        tagline: tagline || undefined,
        style,
        layout,
      });
    } finally {
      setIsExporting(false);
    }
  }, [title, tagline, style, layout]);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog className="max-w-3xl w-full">
            <Modal.Header>
              <div className="flex flex-col">
                <Modal.Heading>Customize your brand assets</Modal.Heading>
                <span className="text-xs text-muted">Turn your logo into a complete brand kit</span>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="p-0 flex flex-col md:flex-row min-h-[400px]">
              {/* Left panel — Preview */}
              <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border">
                <Tabs
                  className="w-full"
                  selectedKey={activeTab}
                  onSelectionChange={(key) => setActiveTab(key as string)}
                >
                  <Tabs.ListContainer className="px-4 pt-4">
                    <Tabs.List aria-label="Preview assets">
                      {PREVIEW_ASSETS.map((asset) => (
                        <Tabs.Tab key={asset.id} id={asset.id}>
                          {PREVIEW_TAB_LABELS[asset.id] ?? asset.label}
                          <Tabs.Indicator className="bg-accent" />
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>
                  </Tabs.ListContainer>

                  {PREVIEW_ASSETS.map((asset) => (
                    <Tabs.Panel key={asset.id} id={asset.id} className="flex-1 flex items-center justify-center p-6">
                      <div
                        className="w-full rounded-lg overflow-hidden border border-border/50 bg-surface-secondary"
                        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
                      >
                        {previewSvg && (
                          <div
                            className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: previewSvg }}
                          />
                        )}
                      </div>
                    </Tabs.Panel>
                  ))}
                </Tabs>

                <p className="text-xs text-muted px-6 pb-4">
                  Used for link previews when you share your project
                </p>
              </div>

              {/* Right panel — Controls */}
              <div className="w-full md:w-72 flex flex-col gap-5 p-6">
                <TextField>
                  <Label className="text-sm text-muted">Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project name"
                    variant="secondary"
                  />
                </TextField>

                <TextField>
                  <Label className="text-sm text-muted">Tagline</Label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Short description"
                    variant="secondary"
                  />
                </TextField>

                <Separator orientation="horizontal" variant="secondary" />

                {/* Style selector */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted">Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setStyle(preset.id)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                          style === preset.id
                            ? "border-accent/40 bg-accent/5 text-accent"
                            : "border-border hover:border-border/80 hover:bg-surface-secondary"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout selector */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted">Layout</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAYOUT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setLayout(preset.id)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                          layout === preset.id
                            ? "border-accent/40 bg-accent/5 text-accent"
                            : "border-border hover:border-border/80 hover:bg-surface-secondary"
                        }`}
                      >
                        <Icon icon={preset.icon} width={14} height={14} />
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1" />

                <Button
                  variant="primary"
                  className="w-full"
                  onPress={handleExport}
                  isDisabled={isExporting}
                  isPending={isExporting}
                >
                  Download Brand Kit
                </Button>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
