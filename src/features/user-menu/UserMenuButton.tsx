import { CrownDiamond } from "@gravity-ui/icons";
import { useAuth } from "#/queries/auth/use-auth";
import { SignInBadge } from "./SignInBadge";
import { UserMenu } from "./UserMenu";

export function UserMenuButton() {
  const user = useAuth();

  if (!user) return <SignInBadge />;
  return (
    <div className="flex items-center gap-2">
      {user.plan === "creator" && (
        <span className="flex items-center gap-1.5 rounded-md border border-primary/20 bg-gradient-to-r from-primary/15 to-primary/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm shadow-primary/10">
          <CrownDiamond className="size-3" />
          Creator
        </span>
      )}
      <UserMenu user={user} />
    </div>
  );
}
