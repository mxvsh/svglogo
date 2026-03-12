export interface ExportPayload {
  format: string;
  icon: string;
  color: string;
  border: number;
  background: string;
}

export function trackDownload(payload: ExportPayload) {
  if (typeof window === "undefined" || typeof umami === "undefined") return;

  if (typeof umami?.track === "function") {
    umami.track("download logo", {
      format: payload.format,
      icon: payload.icon,
      color: payload.color,
      border: payload.border,
      background: payload.background,
    });
  }
}
