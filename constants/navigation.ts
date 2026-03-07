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
    title: "Model Execution",
    url: "/dashboard/model-execution",
    icon: ModelExecutionIcon,
    roles: [UserRole["SUPER USER"], UserRole["USER ADMIN"]],
  },
  {
    title: "PD Management",
    url: "/dashboard/model-management",
    icon: ModelManagementIcon,
    roles: [UserRole["SUPER USER"], UserRole["USER ADMIN"]],
  },
  {
    title: "Reporting",
    url: "/dashboard/reporting",
    icon: ReportingIcon,
    roles: [UserRole.USER, UserRole["SUPER USER"], UserRole["USER ADMIN"]],
  },
  {
    title: "Team Management",
    url: "/dashboard/team-management",
    icon: TeamManagementIcon,
    roles: [UserRole.ADMIN, UserRole["USER ADMIN"]],
  },
  {
    title: "Audit Log",
    url: "/dashboard/audit-log",
    icon: SettingsIcon,
    roles: [UserRole.ADMIN, UserRole["USER ADMIN"]],
  },
];
