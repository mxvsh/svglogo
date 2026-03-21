import { useAuth } from "#/queries/auth/use-auth";
import { SignInBadge } from "./SignInBadge";
import { UserMenu } from "./UserMenu";

export function UserMenuButton() {
  const user = useAuth();

  if (!user) return <SignInBadge />;
  return <UserMenu user={user} />;
}
