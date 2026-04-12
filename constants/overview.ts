import { Process } from "../types";

export type DataSourceType = "upload" | "api" | "both" | null;
export type PanelStep = "datasource" | "configure" | "execute";
export type ExecPhase = "idle" | "running" | "done";

export type ProcessCategory =
  | "all"
  | "dispute"
  | "reconciliation"
  | "reporting";
export type ProcessStatus = "all" | "active" | "draft" | "archived";

export const API_CONNECTIONS = [
  {
    name: "Arbiter 2.0",
    desc: "Dispute management and chargeback portal",
    sync: "2026-03-26 09:15",
    icon: "🛡️",
  },
  {
    name: "CC Portal",
    desc: "Core commerce portal for transaction data",
    sync: "2026-03-26 08:45",
    icon: "💳",
  },
  {
    name: "Slack",
    desc: "Notifications and alerts for process completion",
    sync: "2026-03-26 09:30",
    icon: "🌐",
  },
];

export const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  { label: "Dispute Management", value: "dispute" },
  { label: "Reconciliation", value: "reconciliation" },
  { label: "Reporting", value: "reporting" },
];

export const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];