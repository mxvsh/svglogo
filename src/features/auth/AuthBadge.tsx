import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import { ArrowRightFromSquare, Lock } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "#/queries/auth/use-auth";
import { signoutFn } from "#/server/auth";
import { setUser } from "#/commands/auth/set-user";
import { AuthModal } from "./AuthModal";

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function AuthBadge() {
  const user = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!user) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
        >
          <Button
            size="sm"
            variant="primary"
            onPress={() => setModalOpen(true)}
          >
            <Lock />
            Sign in to unlock
          </Button>
        </motion.div>
        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  async function handleSignOut() {
    await signoutFn();
    setUser(null);
  }

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar>
          <Avatar.Fallback>{getInitials(user.email)}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Fallback>{getInitials(user.email)}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-xs leading-none text-muted">{user.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu onAction={(key) => { if (key === "signout") handleSignOut(); }}>
          <Dropdown.Item id="signout" textValue="Sign out" variant="danger">
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Sign out</Label>
              <ArrowRightFromSquare className="size-3.5 text-danger" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
