"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import * as React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Users } from "lucide-react";
import { useTeams } from "@/hooks/use-teams";
import { UserRole } from "@/types";

interface NavMainProps {
  items: readonly NavItem[];
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p className="text-[10px] font-[700] uppercase tracking-widest text-InfraMuted/60 px-4 mb-1">
    {children}
  </p>
);

const Divider = () => (
  <div className="my-3 mx-4 border-t border-InfraBorder/40" />
);

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore((s) => s);

  const isAdmin = user?.role === UserRole?.ADMIN;
  const { data: teamsData } = useTeams();

  const teams = teamsData?.data ?? [];
  const firstFiveTeam = teams?.slice(0, 5);
  const userRole = user?.role;

  const isByte = EnvironmentHelper.isDemo();
  const activeItems = items;

  const filteredItems = React.useMemo(() => {
    if (!userRole) return [];
    return activeItems.filter((item) =>
      item.roles?.includes(userRole as never),
    );
  }, [activeItems, userRole]);

  const getActiveUrl = React.useCallback(() => {
    const exactMatch = filteredItems.find((item) => pathname === item.url);
    if (exactMatch) return exactMatch.url;

    const matchingItems = filteredItems.filter((item) =>
      pathname.startsWith(item.url + "/"),
    );

    if (matchingItems.length > 0) {
      return matchingItems.sort((a, b) => b.url.length - a.url.length)[0].url;
    }

    return null;
  }, [pathname, filteredItems]);

  const activeUrl = getActiveUrl();
  const isActive = (url: string) => url === activeUrl;

  return (
    <SidebarGroup className="flex flex-col">
      {/* ── Main Nav ── */}
      <SidebarMenu className="flex flex-col gap-3">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2 rounded-[12px] bg-primary_40/10 animate-pulse"
              >
                <div className="w-6 h-6 rounded-md bg-primary_40/30" />
                <div className="h-3 w-24 rounded bg-primary_40/20" />
              </div>
            ))}
          </>
        ) : (
          filteredItems.length > 0 &&
          filteredItems.map((item, index) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={`${item.url}-${index}`}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn(
                    "transition-colors duration-200 rounded-[12px] !px-4",
                    active
                      ? "bg-[#F5A623] text-white"
                      : "text-InfraMuted hover:text-white hover:bg-[#F5A623]/70",
                    isByte && active && "bg-[#F5A623]",
                  )}
                  data-active={active}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 w-full"
                  >
                    {item.icon && <item.icon isActive={active} />}
                    <span className="text-[14px] font-[500]">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })
        )}
      </SidebarMenu>

      {!isAdmin && (
        <>
          <Divider />
          <SectionLabel>My Team</SectionLabel>
          <div className="px-2 flex flex-col gap-2">
            {firstFiveTeam?.map((team) => (
              <div
                key={team?.id}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-[10px] hover:bg-InfraBorder/20 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-3.5 h-3.5 text-[#F5A623]" />
                </div>
                <p className="text-[12px] font-[500] text-InfraMuted truncate leading-none">
                  {team?.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* <Divider />
      <SectionLabel>Active APIs</SectionLabel>
      <div className="flex flex-col gap-1 px-2">
        {ACTIVE_APIS.map((api) => (
          <div
            key={api.name}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-[10px] hover:bg-InfraBorder/20 transition-colors cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
              <div className="absolute inset-0 rounded-full bg-[#F5A623]/30 animate-ping" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-[500] text-InfraMuted truncate leading-none mb-0.5">
                {api.name}
              </p>
              <p className="text-[10px] text-InfraMuted/50 truncate">
                {api.desc}
              </p>
            </div>
            <span className="text-[9px] font-[700] text-[#F5A623] bg-[#F5A623]/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
              Live
            </span>
          </div>
        ))}
      </div> */}
    </SidebarGroup>
  );
}
