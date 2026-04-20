"use client";

import React, { useMemo } from "react";
import { Brand, FlwLogo } from "@/components/shared/Brand";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { navItems } from "@/constants/navigation";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNavigation";
import AppHeader from "./AppHeader";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  count?: number;
}

interface SidebarData {
  navMain: readonly NavItem[];
  logoIcon: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const sidebarData: SidebarData = useMemo(
    () => ({
      navMain: navItems,
      logoIcon: FlwLogo,
    }),
    [],
  );

  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} />

      <SidebarInset className="w-full md:w-[900px]">
        <AppHeader />
        <main className="bg-[#FFFAFA] rounded-xl px-4 md:px-8 py-6 h-full">
          {children}
        </main>
      </SidebarInset>

      <MobileNav items={sidebarData.navMain} />
    </SidebarProvider>
  );
}
