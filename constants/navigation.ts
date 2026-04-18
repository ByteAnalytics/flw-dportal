import {
  DashboardIcon,
  ModelExecutionIcon,
  TeamManagementIcon,
  SettingsIcon,
  ModelManagementIcon,
} from "@/svg";
import { UserRole } from "@/types";

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: DashboardIcon,
    roles: [UserRole.USER, UserRole.ADMIN],
  },
  {
    title: "Run Process",
    url: "/dashboard/run-process",
    icon: ModelExecutionIcon,
    roles: [UserRole.USER, UserRole["ADMIN"]],
  },
  {
    title: "Teams",
    url: "/dashboard/team-management",
    icon: TeamManagementIcon,
    roles: [UserRole["ADMIN"]],
  },
  {
    title: "Users",
    url: "/dashboard/user-management",
    icon: TeamManagementIcon,
    roles: [UserRole["ADMIN"]],
  },
  {
    title: "Processes",
    url: "/dashboard/process-management",
    icon: ModelExecutionIcon,
    roles: [UserRole["ADMIN"]],
  },
  {
    title: "Activity Log",
    url: "/dashboard/activity-logs",
    icon: ModelManagementIcon,
    roles: [UserRole["ADMIN"]],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: SettingsIcon,
    roles: [UserRole["ADMIN"]],
  },
] as const;
