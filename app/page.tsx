import DesktopAppShell from "#/components/DesktopAppShell";
import DesktopOnlyNotice from "#/components/DesktopOnlyNotice";
import { fetchLatestNotification } from "#/lib/notifications";

export default async function Home() {
  const notification = await fetchLatestNotification();

  return (
    <>
      <DesktopOnlyNotice />
      <DesktopAppShell notification={notification} />
    </>
  );
}
