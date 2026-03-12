import EditorPage from "#/components/EditorPage";
import FABs from "#/components/FABs";
import InfoFab from "#/components/InfoFab";
import UpdatesFab from "#/components/UpdatesFab";
import { fetchLatestNotification } from "#/lib/notifications";

export default async function Home() {
  const notification = await fetchLatestNotification();

  return (
    <>
      <FABs />
      <EditorPage />
      <UpdatesFab notification={notification} />
      <InfoFab />
    </>
  );
}
