import { Avatar, Button, Dropdown } from "@heroui/react";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useSession } from "#/queries/auth/use-session";
import { AuthModal } from "./AuthModal";

export function UserButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  if (!session) {
    return (
      <>
        <Button onPress={() => setModalOpen(true)}>Sign In</Button>
        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar>
          <Avatar.Image src={user.image ?? undefined} alt={user.name ?? user.email} />
          <Avatar.Fallback delayMs={600}>{initials}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end" className="w-52">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image src={user.image ?? undefined} alt={user.name ?? user.email} />
              <Avatar.Fallback delayMs={600}>{initials}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{user.name || "—"}</p>
              <p className="text-xs leading-none text-muted">{user.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu
          onAction={(key) => {
            if (key === "signout") void authClient.signOut();
          }}
        >
          <Dropdown.Item id="profile">My Profile</Dropdown.Item>
          <Dropdown.Item id="collections">Collections</Dropdown.Item>
          <Dropdown.Item id="signout" className="text-danger">Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
