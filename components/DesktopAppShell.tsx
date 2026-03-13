"use client";

import dynamic from "next/dynamic";
import EditorPage from "#/components/EditorPage";
import FABs from "#/components/FABs";
import UpdatesFab from "#/components/UpdatesFab";
import { CollectionsButton } from "#/components/CollectionsButton";
import type { AppNotification } from "#/lib/notifications";

const OnboardingTour = dynamic(() => import("#/components/OnboardingTour"), {
  ssr: false,
});

export default function DesktopAppShell({
  notification,
}: {
  notification: AppNotification | null;
}) {
  return (
    <div className="hidden md:block">
      <OnboardingTour />
      <FABs />
      <CollectionsButton />
      <EditorPage />
      <UpdatesFab notification={notification} />
    </div>
  );
}
