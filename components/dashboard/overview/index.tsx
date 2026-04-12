"use client";

import React from "react";
import { useRouter } from "nextjs-toploader/app";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { RecentActivitiesTable } from "./RecentActivities";

export interface Process {
  id: number;
  title: string;
  category: string;
  categoryType: "chargeback" | "refunds" | "other";
  frequency: string;
  description: string;
  icons: Array<"shield" | "card" | "globe">;
  inputs?: string;
  status?: "active" | "draft" | "archived";
}

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

const ICON_MAP = {
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

const CATEGORY_STYLES: Record<string, string> = {
  chargeback: "bg-[#FFF0D6] text-[#A05C00]",
  refunds: "bg-[#E3EFF9] text-[#1E4E8C]",
  other: "bg-[#F3F3F3] text-[#5B5F5E]",
};

interface ProcessCardProps {
  process: Process;
  onRun: (id?: number) => void;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ process, onRun }) => {
  return (
    <div className="bg-white border border-[#E1E3E2] rounded-[16px] p-5 hover:border-[#E8A020] hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-[14px] font-bold text-[#0A0A0A] leading-snug flex-1">
          {process.title}
        </h3>
        <span className="bg-[#E8F0FF] text-[#2E5DB0] text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
          {process.frequency}
        </span>
      </div>

      <span
        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block mb-3 ${CATEGORY_STYLES[process.categoryType]}`}
      >
        {process.category}
      </span>

      <p className="text-[12px] text-[#7A7E7D] leading-relaxed mb-4">
        {process.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {process.icons.map((icon, i) => (
            <div
              key={i}
              className="w-[22px] h-[22px] rounded-[5px] bg-[#F3F3F3] flex items-center justify-center"
            >
              {ICON_MAP[icon]}
            </div>
          ))}
          {process.inputs && process.inputs !== "—" && (
            <span className="text-[11px] text-[#9A9E9D] ml-1">
              ⊢ {process.inputs}
            </span>
          )}
        </div>
        <Button
          onClick={() => onRun(process.id)}
          className="bg-[#E8A020] hover:bg-[#D4911A] text-white text-[12px] font-semibold h-8 px-4 rounded-[8px] flex items-center gap-1.5"
        >
          <Play className="w-3 h-3 fill-white" />
          Run
        </Button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const router = useRouter();

  // Clicking Run just navigates — the sheet opens on the destination page
  const handleRun = (id?: number) => {
    router.push(`/dashboard/run-process${id ? `?id=${id}` : ""}`);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="mb-6">
          <h1 className="text-[1.4rem] font-bold text-gray-900">
            Welcome back, David
          </h1>
          <p className="text-InfraMuted font-[500] text-sm mt-0.5">
            Here are your team's processes and recent activity
          </p>
        </div>

        <Button
          onClick={() => handleRun()}
          className="bg-[#E8A020] hover:bg-[#D4911A] h-[40px] text-[12px] font-semibold px-4 rounded-[8px] flex items-center gap-1.5"
        >
          <Play className="w-3 h-3 fill-white" />
          Run a process
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        <StatCard title="My Processes" value={"1"} />
        <StatCard title="Executions Today" value="2" />
        <StatCard title="API Connections" value="3" />
        <StatCard title="Team Members" value="4" />
      </div>
      <RecentActivitiesTable />
    </div>
  );
};

export default Dashboard;
