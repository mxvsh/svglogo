export interface AppNotification {
  id: string;
  appId: string;
  title: string;
  description: string;
  banner: string;
  enabled: boolean;
  startAt: string;
  endAt: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

interface NotificationsResponse {
  items: AppNotification[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export async function fetchLatestNotification(): Promise<AppNotification | null> {
  const endpoint = process.env.NOTIFICATIONS_URL;
  if (!endpoint) return null;

  try {
    const isDev = process.env.NODE_ENV === "development";
    const res = await fetch(endpoint, {
      next: isDev ? undefined : { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as NotificationsResponse;
    const active = data.items?.find((item) => item.enabled) ?? null;
    return active;
  } catch {
    return null;
  }
}
