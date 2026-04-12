import {
  DashboardIcon,
  ModelExecutionIcon,
  ModelManagementIcon,
  ReportingIcon,
  SettingsIcon,
  TeamManagementIcon,
} from "@/svg";
import { UserRole } from "@/types";

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: DashboardIcon,
    roles: [
      UserRole.USER,
      UserRole.ADMIN,
      UserRole["SUPER USER"],
      UserRole["USER ADMIN"],
    ],
  },
  {
    title: "Run Process",
    url: "/dashboard/run-process",
    icon: ModelExecutionIcon,
    roles: [UserRole.USER, UserRole["SUPER USER"], UserRole["USER ADMIN"]],
  },
  {
    title: "Team Management",
    url: "/dashboard/team-management",
    icon: TeamManagementIcon,
    roles: [UserRole["ADMIN"]],
  },
] as const;
