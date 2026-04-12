import {
  ActivityTracking,
  ApiConnectionIcon,
  ProcessAutomationIcon,
} from "@/svg";

export const AUTH_SLIDES = [
  {
    tag: "Process Automation",
    title: "Run financial ops processes in seconds, not hours",
    description:
      "Automate POS chargeback evidence generation, dispute retrieval, and settlement confirmation — processes that used to take your team 40+ hours a week.",
    stats: [
      { value: "40hrs", label: "saved per week" },
      { value: "95%", label: "accuracy rate" },
    ],
    icon: <ProcessAutomationIcon />,
  },
  {
    tag: "API Connections",
    title: "Connected to Arbiter 2.0, CC Portal & more",
    description:
      "Pull dispute data directly from Arbiter 2.0, validate transactions on CC Portal, and push notifications to Slack — all in a single automated run.",
    stats: [
      { value: "3+", label: "API integrations" },
      { value: "37", label: "avg API calls per run" },
    ],
    icon: <ApiConnectionIcon />,
  },
  {
    tag: "Activity Tracking",
    title: "Every execution logged, every output downloadable",
    description:
      "Full audit trail for every process run. Download Excel reports, review execution logs, and get instant Slack notifications when a process completes.",
    stats: [
      { value: "100%", label: "audit coverage" },
      { value: "10.2s", label: "avg execution time" },
    ],
    icon: <ActivityTracking />,
  },
];
