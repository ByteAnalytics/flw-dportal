import { TableColumn } from "@/components/ui/custom-table";

export const processTableColumns: TableColumn[] = [
  { key: "name", label: "Process Name" },
  { key: "team", label: "Team" },
  { key: "frequency", label: "Frequency" },
  { key: "effort", label: "Effort" },
  { key: "apis", label: "APIs" },
  { key: "status", label: "Status" },
  { key: "actions", label: "", width: "60px" },
];

export const frequencyOptions = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Quarterly", value: "Quarterly" },
];

export const effortOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const filterFrequencyOptions = [
  { label: "All Frequency", value: "" },
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Quarterly", value: "Quarterly" },
];

export const filterEffortOptions = [
  { label: "All Effort", value: "" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const EFFORT_BADGE_STYLES: Record<string, string> = {
  Low: "bg-[#DCFCE7] text-[#166534]",
  Medium: "bg-[#FEF9C3] text-[#854D0E]",
  High: "bg-[#FFE4E6] text-[#9F1239]",
};

export const FREQUENCY_BADGE_STYLES: Record<string, string> = {
  Daily: "bg-[#DBEAFE] text-[#1D4ED8]",
  Weekly: "bg-[#F3E8FF] text-[#7C3AED]",
  Monthly: "bg-[#FEF9C3] text-[#854D0E]",
  Quarterly: "bg-[#FFEDD5] text-[#9A3412]",
};
