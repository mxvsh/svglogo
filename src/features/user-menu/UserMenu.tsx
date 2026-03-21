import { Avatar, Dropdown, Label } from "@heroui/react";
import {
  ArrowRightFromSquare,
  CrownDiamond,
  Person,
} from "@gravity-ui/icons";
import type { AuthUser } from "#/store/auth-store";
import { signoutFn } from "#/server/auth";
import { setUser } from "#/commands/auth/set-user";
import { openUpgradeModal } from "#/commands/upgrade/open-upgrade-modal";

function getInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: { user: AuthUser }) {
  const isCreator = user.plan === "creator";

  async function handleSignOut() {
    await signoutFn();
    setUser(null);
  }

  function handleAction(key: React.Key) {
    if (key === "signout") handleSignOut();
    if (key === "upgrade") openUpgradeModal();
    if (key === "account") window.open("/account", "_blank");
  }

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar>
          <Avatar.Fallback>{getInitials(user.fullName, user.email)}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end" className="w-56">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Fallback>{getInitials(user.fullName, user.email)}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              {user.fullName && (
                <p className="text-sm leading-5 font-medium">{user.fullName}</p>
              )}
              <p className="text-xs leading-none text-muted">{user.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu onAction={handleAction}>
          <Dropdown.Section>
            <Dropdown.Item id="account" textValue="My Account">
              <div className="flex w-full items-center justify-between gap-2">
                <Label>My Account</Label>
                <Person className="size-3.5 text-muted" />
              </div>
            </Dropdown.Item>
            {!isCreator && (
              <Dropdown.Item id="upgrade" textValue="Buy Creator Plan">
                <div className="flex w-full items-center justify-between gap-2">
                  <Label>Buy Creator Plan</Label>
                  <CrownDiamond className="size-3.5 text-muted" />
                </div>
              </Dropdown.Item>
            )}
          </Dropdown.Section>
          <Dropdown.Section>
            <Dropdown.Item id="signout" textValue="Sign out" variant="danger">
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Sign out</Label>
                <ArrowRightFromSquare className="size-3.5 text-danger" />
              </div>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
