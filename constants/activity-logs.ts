import { TableColumn } from "@/components/ui/custom-table";

export const activityLogColumns: TableColumn[] = [
  { key: "user", label: "User" },
  { key: "team", label: "Team" },
  { key: "process", label: "Process" },
  { key: "status", label: "Status" },
  { key: "detail", label: "Detail" },
  { key: "timestamp", label: "Timestamp" },
];

export const LOG_STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot?: string }
> = {
  completed: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
  },
  failed: {
    bg: "bg-[#FFE4E6]",
    text: "text-[#9F1239]",
  },
  info: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1D4ED8]",
  },
};

export const filterStatusOptions = [
  { label: "All Status", value: "" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Info", value: "info" },
];
