import { LayoutDashboard } from "lucide-react";
import { BottomNavItem } from "./bottom-nav-item";

// @catalyst:auth-start

import { Suspense } from "react";
import ProfileMenu from "@/components/auth/profile-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getChromeUser } from "@/lib/session";
// @catalyst:auth-end

export default function BottomNavigation() {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t bg-background px-2 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden">
      <div className="flex h-16 w-full items-center justify-around">
        <BottomNavItem href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        {/* @catalyst:auth-start */}
        <Suspense fallback={<ProfileTrigger initials="" />}>
          <ProfileSlot />
        </Suspense>
        {/* @catalyst:auth-end */}
      </div>
    </nav>
  );
}

// @catalyst:auth-start
function ProfileTrigger({ initials, image }: { initials: string; image?: string }) {
  return (
    <span className="grid h-fit w-16 cursor-pointer place-items-center gap-1 rounded-md p-1">
      <Avatar className="size-6">
        <AvatarImage alt="You" src={image || ""} />
        <AvatarFallback className="text-xs">{initials || "\u00b7"}</AvatarFallback>
      </Avatar>
      <span className="text-muted-foreground text-xs">You</span>
    </span>
  );
}

async function ProfileSlot() {
  const user = await getChromeUser();
  if (!user) return <ProfileTrigger initials="" />;

  const initials =
    user.name
      ?.split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("") || "A";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="grid h-fit w-16 place-items-center gap-1 p-1"
          size="icon"
          variant="ghost"
        >
          <Avatar className="size-6">
            <AvatarImage alt="You" src={user.image || ""} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-xs">You</span>
        </Button>
      </DropdownMenuTrigger>
      <ProfileMenu
        userName={user.name}
        userEmail={user.email}
        userImage={user.image || undefined}
      />
    </DropdownMenu>
  );
}
// @catalyst:auth-end
