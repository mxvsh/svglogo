export interface ExportPayload {
  format: string;
  icon: string;
  color: string;
  border: number;
  background: string;
}

export function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof umami === "undefined") return;

  if (typeof umami?.track === "function") {
    if (eventData) {
      umami.track(eventName, eventData);
    } else {
      umami.track(eventName);
    }
  }
}

export function trackDownload(payload: ExportPayload) {
  trackEvent("download logo", {
    format: payload.format,
    icon: payload.icon,
    color: payload.color,
    border: payload.border,
    background: payload.background,
  });
}
