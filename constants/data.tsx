import { Process } from "@/types";
import React from "react";
import { DataSourceType } from "./overview";

export const PROCESSES: Process[] = [
  {
    id: 1,
    title: "Generating POS Chargeback Evidence on CP",
    category: "Chargeback",
    categoryType: "chargeback",
    frequency: "Daily",
    description:
      "Finding transactions singly on CP and generating evidence for successful transactions which takes up to a minute per transaction...",
    icons: ["shield", "card"],
    inputs: "RRN, JPEG, PNG, CP",
  },
  {
    id: 2,
    title: "Transaction Settlement Confirmation",
    category: "Chargeback",
    categoryType: "chargeback",
    frequency: "Daily",
    description:
      "Confirming settlement for failed transactions across all rails. Confirming settlement by checking through different daily...",
    icons: ["shield", "globe"],
    inputs: "CSVs, Excel",
  },
  {
    id: 3,
    title: "Retrieving Evidence & Declining/Accepting Disputes on Arbiter 2.0",
    category: "Chargeback",
    categoryType: "chargeback",
    frequency: "Daily",
    description:
      "The officer validates the claims singly on the dispute portal which takes 40 hours/week based on volume received...",
    icons: ["shield", "card", "globe"],
    inputs: "JPEG, PDF, PNG, CP",
  },
  {
    id: 4,
    title: "RRN Retrievals & IPG Refunds Processing",
    category: "Refunds",
    categoryType: "refunds",
    frequency: "Daily",
    description:
      "Opening reports singly to retrieve details for processing refunds on Arbiter 2.0, this takes one minute per transactions...",
    icons: ["shield", "globe"],
    inputs: "—",
  },
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  shield: (
    <svg
      className="w-[14px] h-[14px] text-[#006D37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  card: (
    <svg
      className="w-[14px] h-[14px] text-[#006D37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  globe: (
    <svg
      className="w-[14px] h-[14px] text-[#006D37]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
};

export const CATEGORY_STYLES: Record<string, string> = {
  chargeback: "bg-[#FFF0D6] text-[#A05C00]",
  refunds: "bg-[#E3EFF9] text-[#1E4E8C]",
  other: "bg-[#F3F3F3] text-[#5B5F5E]",
};

export // Source options data
const SOURCE_OPTIONS: {
  key: DataSourceType;
  icon: string;
  title: string;
  sub: string;
}[] = [
  {
    key: "upload",
    icon: "↑",
    title: "File Upload",
    sub: "CSV, Excel, PDF or images",
  },
  {
    key: "api",
    icon: "⚡",
    title: "API Connection",
    sub: "Pull from integrations",
  },
  {
    key: "both",
    icon: "⇄",
    title: "Upload + API",
    sub: "Combine both sources",
  },
];