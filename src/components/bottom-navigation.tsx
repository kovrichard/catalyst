import { LayoutDashboard } from "lucide-react";
import { BottomNavItem } from "./bottom-nav-item";

export default function BottomNavigation() {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t bg-background px-2 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden">
      <div className="flex h-16 w-full items-center justify-around">
        <BottomNavItem href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
      </div>
    </nav>
  );
}
