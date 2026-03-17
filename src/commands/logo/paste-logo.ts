import { isLogoStateLike } from "#/domain/logo/logo.validators";
import { readText } from "#/infra/clipboard/clipboard";
import { updateLogo } from "./update-logo";

export async function pasteLogo(): Promise<
  { ok: true } | { ok: false; reason: string }
> {
  try {
    const text = await readText();
    const parsed = JSON.parse(text);
    if (!isLogoStateLike(parsed)) {
      return { ok: false, reason: "Clipboard does not contain valid icon data" };
    }
    updateLogo((d) => {
      d.iconName = parsed.iconName;
      d.iconColor = parsed.iconColor;
      d.iconSize = parsed.iconSize;
      d.background = parsed.background;
      d.borderRadius = parsed.borderRadius;
      d.borderWidth = parsed.borderWidth;
      d.borderColor = parsed.borderColor;
    });
    return { ok: true };
  } catch {
    return { ok: false, reason: "Paste failed" };
  }
}
