import { Avatar, Button, Dropdown } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { signoutFn } from "#/server/auth";
import { useSession } from "#/queries/auth/use-session";
import { useAuthModalOpen } from "#/queries/ui/use-auth-modal";
import { closeAuthModal } from "#/commands/ui/open-auth-modal";
import { getInitials } from "#/lib/initials";
import { AuthModal } from "./AuthModal";
import { ProfileModal } from "./ProfileModal";
import { CollectionsModal } from "./CollectionsModal";

export function UserButton() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const authModalOpen = useAuthModalOpen();

  useEffect(() => {
    if (authModalOpen) setModalOpen(true);
  }, [authModalOpen]);

  if (isPending) return null;

  if (!session) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Button onPress={() => setModalOpen(true)}>Sign In</Button>
        </motion.div>
        <AuthModal isOpen={modalOpen} onClose={() => { setModalOpen(false); closeAuthModal(); }} />
      </>
    );
  }

  const user = session.user;
  const initials = getInitials(user.name, user.email);

  async function handleSignOut() {
    sessionStorage.removeItem("svglogo-synced-user");
    await signoutFn();
    await queryClient.invalidateQueries({ queryKey: ["session"] });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
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
              if (key === "profile") setProfileOpen(true);
              else if (key === "collections") setCollectionsOpen(true);
              else if (key === "signout") void handleSignOut();
            }}
          >
            <Dropdown.Item id="profile">My Profile</Dropdown.Item>
            <Dropdown.Item id="collections">Collections</Dropdown.Item>
            <Dropdown.Item id="signout" className="text-danger">Sign Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      </motion.div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <CollectionsModal isOpen={collectionsOpen} onClose={() => setCollectionsOpen(false)} />
    </>
  );
}
