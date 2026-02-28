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
    roles: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_USER],
  },
  {
    title: "Model Execution",
    url: "/dashboard/model-execution",
    icon: ModelExecutionIcon,
    roles: [UserRole.SUPER_USER],
  },
  {
    title: "PD Management",
    url: "/dashboard/model-management",
    icon: ModelManagementIcon,
    roles: [UserRole.SUPER_USER],
  },
  {
    title: "Reporting",
    url: "/dashboard/reporting",
    icon: ReportingIcon,
    roles: [UserRole.USER, UserRole.SUPER_USER],
  },
  {
    title: "Team Management",
    url: "/dashboard/team-management",
    icon: TeamManagementIcon,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Audit Log",
    url: "/dashboard/audit-log",
    icon: SettingsIcon,
    roles: [UserRole.ADMIN],
  },
];
