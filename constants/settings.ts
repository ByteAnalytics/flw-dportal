export const iconOptions = [
  { label: "Plug (Generic)", value: "plug" },
  { label: "Globe", value: "globe" },
  { label: "Database", value: "database" },
  { label: "Cloud", value: "cloud" },
  { label: "Server", value: "server" },
  { label: "Credit Card", value: "credit-card" },
  { label: "File", value: "file" },
  { label: "Bell", value: "bell" },
];

export const timezoneOptions = [
  { label: "Africa/Lagos (WAT)", value: "Africa/Lagos" },
  { label: "UTC", value: "UTC" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
];

export const INTEGRATION_BG_COLORS: Record<string, string> = {
  arbiter: "bg-[#EEF2FF]",
  cc_portal: "bg-[#FFF7ED]",
  sftp: "bg-[#F0FDF4]",
  slack: "bg-[#F5F3FF]",
  oneview: "bg-[#FFF0F0]",
  azure: "bg-[#EFF6FF]",
};

export const NOTIFICATION_LABELS: Record<
  string,
  { title: string; description: string }
> = {
  process_completion: {
    title: "Process completion",
    description: "Send Slack notification when a process finishes successfully",
  },
  process_failure: {
    title: "Process failure",
    description: "Alert immediately when a process fails or errors",
  },
  daily_email_summary: {
    title: "Daily email summary",
    description: "Receive a daily digest of all process executions",
  },
  api_integration_offline: {
    title: "API integration offline",
    description: "Alert when a connected API becomes unreachable",
  },
  new_user_onboarded: {
    title: "New user onboarded",
    description: "Notify when an admin adds a new user to the platform",
  },
};
