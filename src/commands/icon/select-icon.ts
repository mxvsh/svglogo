import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export function selectIcon(name: string) {
  const store = useLogoStore.getState();
  store.set((d) => {
    d.iconName = name;
  });
  trackEvent("select icon", { icon: name, prefix: name.split(":")[0] });
  store.closeIconPicker();
}
