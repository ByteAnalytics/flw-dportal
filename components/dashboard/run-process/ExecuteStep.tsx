"use client";

import React from "react";
import { ArrowLeft, Download } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import { ExecPhase, Process } from "@/types/processes";

interface ExecuteStepProps {
  process: Process;
  execPhase: ExecPhase;
  onRunAnother: () => void;
  onDashboard: () => void;
}

// Types
interface OutputFile {
  name: string;
  size: string;
  icon: string;
  primary: boolean;
}

interface StatItem {
  label: string;
  value: string;
  green?: boolean;
}

// Reusable Loading/Executing Component
const ExecutingState: React.FC<{ processTitle: string }> = ({
  processTitle,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
    <div className="w-14 h-14 border-[3px] border-[#F0F2EF] border-t-[#006D37] rounded-full animate-spin" />
    <div>
      <h3 className="text-[16px] font-bold mb-1.5">Executing Process...</h3>
      <p className="text-[13px] text-[#9A9E9D]">{processTitle}</p>
    </div>
    <div className="w-full h-1.5 bg-[#F0F2EF] rounded-full overflow-hidden">
      <div className="h-full bg-[#006D37] rounded-full w-[60%] transition-all duration-1000" />
    </div>
    <p className="text-[12px] text-[#006D37] font-medium flex items-center gap-1.5">
      ✓ Processing records...
    </p>
  </div>
);

// Reusable Success Header Component
const SuccessHeader: React.FC<{ processTitle: string }> = ({
  processTitle,
}) => (
  <div className="text-center py-2">
    <div className="w-12 h-12 bg-[#D6F5E3] rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-6 h-6 text-[#006D37]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <h3 className="text-[16px] font-bold mb-1">
      Process Completed Successfully
    </h3>
    <p className="text-[13px] text-[#9A9E9D]">{processTitle}</p>
  </div>
);

// Reusable Stat Card Component
const StatCard: React.FC<StatItem> = ({ label, value, green }) => (
  <div className="bg-[#F9F9F9] rounded-[10px] p-3">
    <p className="text-[11px] text-[#9A9E9D] mb-1.5">{label}</p>
    <p
      className={`text-[18px] font-bold ${green ? "text-[#006D37]" : "text-[#0A0A0A]"}`}
    >
      {value}
    </p>
  </div>
);

// Reusable Output File Component
const OutputFileItem: React.FC<OutputFile> = ({
  name,
  size,
  icon,
  primary,
}) => (
  <div className="border border-[#E1E3E2] rounded-[10px] p-3 flex items-center gap-3">
    <div className="w-8 h-8 bg-[#E8F5EC] rounded-[8px] flex items-center justify-center text-base flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-semibold text-[#0A0A0A] truncate">
        {name}
      </p>
      <p className="text-[11px] text-[#9A9E9D]">Generated just now · {size}</p>
    </div>
    <button
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[11px] font-semibold flex-shrink-0 ${
        primary
          ? "bg-[#006D37] text-white"
          : "bg-white border border-[#E1E3E2] text-[#5B5F5E]"
      }`}
    >
      <Download className="w-3 h-3" /> Download
    </button>
  </div>
);

// Reusable Output Files Section Component
const OutputFilesSection: React.FC<{ files: OutputFile[] }> = ({ files }) => (
  <div>
    <p className="text-[13px] font-semibold mb-2.5">Output Files</p>
    <div className="space-y-2">
      {files.map((file) => (
        <OutputFileItem key={file.name} {...file} />
      ))}
    </div>
  </div>
);

// Reusable Slack Notification Component
const SlackNotification: React.FC<{ channel?: string }> = ({
  channel = "#ops-automation",
}) => (
  <div className="bg-[#E9F9EF] rounded-[10px] px-3.5 py-2.5 flex items-center gap-2 text-[12px] text-[#006D37] font-medium">
    🌐 Slack notification sent to{" "}
    <strong className="font-bold">{channel}</strong>
  </div>
);

// Reusable Footer Actions Component
interface FooterActionsProps {
  onRunAnother: () => void;
  onDashboard: () => void;
  runAnotherText?: string;
  dashboardText?: string;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  onRunAnother,
  onDashboard,
  runAnotherText = "↻ Run Another",
  dashboardText = "Dashboard",
}) => (
  <div className="flex gap-2.5 pt-3 border-t border-[#E1E3E2]">
    <CustomButton
      title={runAnotherText}
      onClick={onRunAnother}
      textClassName="!text-[0.875rem] font-[600]"
      className="flex-1 rounded-[8px] !h-[42px] bg-[#006D37] hover:bg-[#D4911A]"
    />
    <button
      onClick={onDashboard}
      className="flex-1 bg-white border border-[#E1E3E2] text-[#5B5F5E] font-medium text-[13px] rounded-[8px] py-2.5 flex items-center justify-center gap-1.5 hover:bg-[#F3F3F3]"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> {dashboardText}
    </button>
  </div>
);

// Data
const OUTPUT_FILES: OutputFile[] = [
  {
    name: "retrieving_evidence_disputes_arbiter_2026-04-11.xlsx",
    size: "2.4 MB",
    icon: "📊",
    primary: true,
  },
  {
    name: "execution_log.txt",
    size: "14 KB",
    icon: "📄",
    primary: false,
  },
];

const STATS: StatItem[] = [
  { label: "Duration", value: "10.2s" },
  { label: "Records Processed", value: "95" },
  { label: "API Calls Made", value: "37" },
  { label: "Status", value: "Complete", green: true },
];

export const ExecuteStep: React.FC<ExecuteStepProps> = ({
  process,
  execPhase,
  onRunAnother,
  onDashboard,
}) => {
  if (execPhase === "running") {
    return <ExecutingState processTitle={process.process_name} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Success Header */}
      <SuccessHeader processTitle={process.process_name} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Output Files */}
      <OutputFilesSection files={OUTPUT_FILES} />

      {/* Slack Notification */}
      <SlackNotification />

      {/* Footer Actions */}
      <FooterActions onRunAnother={onRunAnother} onDashboard={onDashboard} />
    </div>
  );
};
