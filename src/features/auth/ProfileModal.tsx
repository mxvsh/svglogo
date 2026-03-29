import { Avatar, Button, Form, Input, Label, Modal, TextField, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { updateProfileFn } from "#/server/user.update-profile";
import { useSession } from "#/queries/auth/use-session";
import { getInitials } from "#/lib/initials";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session, refetch } = useSession();
  const user = session?.user;

  const initials = getInitials(user?.name, user?.email ?? "?");

  const [name, setName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfileFn({ data: { name: name.trim() } });
    if (result?.error) {
      toast("Failed to update profile");
    } else {
      await refetch();
      toast("Profile updated");
    }
    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Icon icon="lucide:user" width={20} />
              </Modal.Icon>
              <div>
                <Modal.Heading>My Profile</Modal.Heading>
                <p className="text-xs text-muted">Manage your account details</p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-6 py-6">
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <Avatar.Image src={user?.image ?? undefined} alt={user?.name ?? ""} />
                  <Avatar.Fallback delayMs={600}>{initials}</Avatar.Fallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{user?.name || "—"}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
              </div>

              <Form className="flex flex-col gap-4" onSubmit={handleSave}>
                <TextField name="name" value={name} onChange={setName}>
                  <Label>Full name</Label>
                  <Input
                    placeholder="Your name"
                    variant="secondary"
                    className="focus:ring-inset"
                  />
                </TextField>
                <Button type="submit" variant="primary" isPending={loading} className="w-full">
                  Save changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
