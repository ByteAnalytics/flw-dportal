"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebarData } from "@/types/navigation";
import { SideBarCollapseTrigger } from "@/svg";
import { NavMain } from "./AppSidebarMain";
import { LogOut } from "lucide-react";
import AlertModal from "@/components/shared/AlertModal";
import { useAuthStore } from "@/stores/auth-store";
import { usePost } from "@/hooks/use-queries";
import { ApiResponse } from "@/types";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: AppSidebarData;
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  const { toggleSidebar, state } = useSidebar();
  const { navMain, logoIcon: LogoComponent } = data;
  const router = useRouter();
  const pathname = usePathname();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const isCollapsed = state === "collapsed";

  const logout = useAuthStore((s) => s.logout);
  const logoutApi = usePost<ApiResponse<string>, null>("/auth/logout");

  const handleLogout = async () => {
    try {
      await logoutApi.mutateAsync(null);
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      logout();
      await router.push("/auth/sign-in");
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      style={
        {
          "--sidebar": "#F3F3F3",
          "--sidebar-foreground": "oklch(0.145 0 0)",
        } as React.CSSProperties
      }
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="mt-2 mb-[2rem] h-[71px] data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground !px-1"
            >
              {LogoComponent && !isCollapsed && <LogoComponent />}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div
          onClick={toggleSidebar}
          className="cursor-pointer mr-[-2rem] w-fit absolute top-[5rem] right-[1rem]"
        >
          <SideBarCollapseTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="px-1 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <LogOut className="h-4 w-4 text-[#FF5C5C]" />
              {!isCollapsed && <span className="text-[#FF5C5C]">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <AlertModal
        isOpen={isLogoutModalOpen}
        setIsOpen={setIsLogoutModalOpen}
        description="Are you sure you want to logout?"
        leftAction={{
          label: "Cancel",
          onClick: () => setIsLogoutModalOpen(false),
          className: "border-[#E5E7EB]",
        }}
        rightAction={{
          label: "Logout",
          isLoading: logoutApi.isPending,
          disabled: logoutApi.isPending,
          onClick: async () => await handleLogout(),
          className: "bg-[#FF5C5C] hover:bg-[#E04B4B] text-white",
        }}
      />
    </Sidebar>
  );
}
