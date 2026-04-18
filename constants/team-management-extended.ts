export const TEAM_COLORS: Record<
  string,
  { text: string; bg: string; dot: string }
> = {
  Chargeback: {
    text: "text-[#D97706]",
    bg: "bg-[#FEF3C7]",
    dot: "bg-[#D97706]",
  },
  Reconciliation: {
    text: "text-[#059669]",
    bg: "bg-[#D1FAE5]",
    dot: "bg-[#059669]",
  },
  Refunds: {
    text: "text-[#3B82F6]",
    bg: "bg-[#DBEAFE]",
    dot: "bg-[#3B82F6]",
  },
  "Retail Operations": {
    text: "text-[#8B5CF6]",
    bg: "bg-[#F3E8FF]",
    dot: "bg-[#8B5CF6]",
  },
  "Settlement Operations": {
    text: "text-[#EC4899]",
    bg: "bg-[#FCE7F3]",
    dot: "bg-[#EC4899]",
  },
  "Treasury Assurance": {
    text: "text-[#10B981]",
    bg: "bg-[#D1FAE5]",
    dot: "bg-[#10B981]",
  },
};

export const TEAM_ICON_BG: Record<string, string> = {
  Chargeback: "bg-[#FEF3C7]",
  Reconciliation: "bg-[#D1FAE5]",
  Refunds: "bg-[#DBEAFE]",
  "Retail Operations": "bg-[#F3E8FF]",
  "Settlement Operations": "bg-[#FCE7F3]",
  "Treasury Assurance": "bg-[#D1FAE5]",
};

export const userManagementColumns = [
  { key: "user", label: "User" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "team", label: "Team" },
  { key: "status", label: "Status" },
  { key: "lastLogin", label: "Last Login" },
  { key: "actions", label: "Actions", width: "80px" },
];

export const filterTeamOptions = (teams: { id: string; name: string }[]) => [
  { label: "All Teams", value: "" },
  ...teams.map((t) => ({ label: t.name, value: t.id })),
];

export const filterStatusOptions = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];