export async function writeText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export async function readText(): Promise<string> {
  return navigator.clipboard.readText();
}

export async function writeImage(blob: Blob): Promise<void> {
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": blob }),
  ]);
}
