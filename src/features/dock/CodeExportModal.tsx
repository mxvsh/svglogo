import { Button, Modal, Tabs, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { type CodeFramework } from "#/domain/export/svg-to-code";
import { generateCode, copyCode } from "#/commands/export/export-code";
import { codeToHtml } from "shiki";

const FRAMEWORKS: { id: CodeFramework; label: string; icon: string; ext: string }[] = [
  { id: "react", label: "React", icon: "simple-icons:react", ext: "jsx" },
  { id: "vue", label: "Vue", icon: "simple-icons:vuedotjs", ext: "vue" },
  { id: "svelte", label: "Svelte", icon: "simple-icons:svelte", ext: "svelte" },
];

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CodeExportModal({ isOpen, onClose }: CodeExportModalProps) {
  const [framework, setFramework] = useState<CodeFramework>("react");
  const [code, setCode] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    generateCode(framework).then((c) => {
      setCode(c);
      setLoading(false);
    });
  }, [isOpen, framework]);

  useEffect(() => {
    if (!code) { setHighlighted(""); return; }
    const lang = framework === "react" ? "jsx" : framework === "vue" ? "vue" : "svelte";
    codeToHtml(code, {
      lang,
      theme: "github-dark-default",
    }).then(setHighlighted);
  }, [code, framework]);

  const handleCopy = async () => {
    const ok = await copyCode(framework);
    toast(ok ? "Code copied" : "Copy failed");
  };

  const fw = FRAMEWORKS.find((f) => f.id === framework)!;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container className="sm:max-w-2xl">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Export as Code</Modal.Heading>
              <p className="text-sm text-muted">
                Copy your logo as a {fw.label} component
              </p>
            </Modal.Header>
            <Modal.Body className="p-0">
              <Tabs
                selectedKey={framework}
                onSelectionChange={(key) => setFramework(key as CodeFramework)}
              >
                <div className="flex items-center justify-between pt-2">
                  <Tabs.ListContainer>
                    <Tabs.List aria-label="Framework">
                      {FRAMEWORKS.map((f) => (
                        <Tabs.Tab key={f.id} id={f.id}>
                          <Icon icon={f.icon} width={14} height={14} />
                          {f.label}
                          <Tabs.Indicator className="bg-accent" />
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>
                  </Tabs.ListContainer>
                  <p className="text-xs text-muted/50 hidden sm:block">
                    Logo.{fw.ext}
                  </p>
                </div>
                {FRAMEWORKS.map((f) => (
                  <Tabs.Panel key={f.id} id={f.id} className="p-0">
                    <div className="h-80 relative">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="size-5 border-2 border-muted/30 border-t-accent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <div
                          className="overflow-auto h-full text-sm [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:text-xs sleek-scroll bg-[#0d1117] rounded-b-lg"
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
                          dangerouslySetInnerHTML={{ __html: highlighted }}
                        />
                      )}
                    </div>
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={onClose}>
                Close
              </Button>
              <Button variant="primary" onPress={handleCopy} isDisabled={loading}>
                <Icon icon="lucide:copy" width={14} height={14} />
                Copy code
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
