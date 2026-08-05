import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader className="py-3.5 pl-[22px]">
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Catalyst" width={28} height={28} />
          Catalyst
        </div>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <Skeleton className="size-8 rounded-lg" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
