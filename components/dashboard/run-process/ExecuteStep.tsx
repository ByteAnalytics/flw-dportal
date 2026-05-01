"use client";

import React from "react";
import { ArrowLeft, Download } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import { ExecPhase, Process } from "@/types/processes";
<<<<<<< HEAD
=======
import {
  RunProcessResponse,
  RunProcessResult,
  buildRunProcessPayload,
  buildRunProcessUrl,
} from "@/hooks/use-run-process";
import { useFileDownload } from "@/hooks/us-file-download";
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f

interface ExecuteStepProps {
  process: Process;
  execPhase: ExecPhase;
<<<<<<< HEAD
=======
  result?: RunProcessResponse | null;
  files?: File[];
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
  onRunAnother: () => void;
  onDashboard: () => void;
}

<<<<<<< HEAD
// Types
interface OutputFile {
  name: string;
  size: string;
  icon: string;
  primary: boolean;
}

=======
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
interface StatItem {
  label: string;
  value: string;
  green?: boolean;
}

<<<<<<< HEAD
// Reusable Loading/Executing Component
=======
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
const ExecutingState: React.FC<{ processTitle: string }> = ({
  processTitle,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
<<<<<<< HEAD
    <div className="w-14 h-14 border-[3px] border-[#F0F2EF] border-t-[#006D37] rounded-full animate-spin" />
=======
    <div className="w-14 h-14 border-[3px] border-[#F0F2EF] border-t-[#f5a623] rounded-full animate-spin" />
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
    <div>
      <h3 className="text-[16px] font-bold mb-1.5">Executing Process...</h3>
      <p className="text-[13px] text-[#9A9E9D]">{processTitle}</p>
    </div>
    <div className="w-full h-1.5 bg-[#F0F2EF] rounded-full overflow-hidden">
<<<<<<< HEAD
      <div className="h-full bg-[#006D37] rounded-full w-[60%] transition-all duration-1000" />
    </div>
    <p className="text-[12px] text-[#006D37] font-medium flex items-center gap-1.5">
=======
      <div className="h-full bg-[#f5a623] rounded-full w-[60%] transition-all duration-1000" />
    </div>
    <p className="text-[12px] text-[#f5a623] font-medium">
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
      ✓ Processing records...
    </p>
  </div>
);

<<<<<<< HEAD
// Reusable Success Header Component
const SuccessHeader: React.FC<{ processTitle: string }> = ({
  processTitle,
=======
const SuccessHeader: React.FC<{ processTitle: string; message?: string }> = ({
  processTitle,
  message,
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
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
<<<<<<< HEAD
      Process Completed Successfully
=======
      {message ?? "Process Completed Successfully"}
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
    </h3>
    <p className="text-[13px] text-[#9A9E9D]">{processTitle}</p>
  </div>
);

<<<<<<< HEAD
// Reusable Stat Card Component
const StatCard: React.FC<StatItem> = ({ label, value, green }) => (
  <div className="bg-[#F9F9F9] rounded-[10px] p-3">
=======
// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<StatItem> = ({ label, value, green }) => (
  <div className="bg-[#F9F9F9] border flex flex-col items-center rounded-[10px] p-3">
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
    <p className="text-[11px] text-[#9A9E9D] mb-1.5">{label}</p>
    <p
      className={`text-[18px] font-bold ${green ? "text-[#006D37]" : "text-[#0A0A0A]"}`}
    >
      {value}
    </p>
  </div>
);

<<<<<<< HEAD
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
=======
// ─── Result details ───────────────────────────────────────────────────────────

const ResultDetails: React.FC<{ result: RunProcessResult }> = ({ result }) => {
  const stats: StatItem[] = [
    result.status
      ? {
          label: "Status",
          value: result.status,
          green: result.status === "verified",
        }
      : null,
    result.bank_name ? { label: "Bank", value: result.bank_name } : null,
    result.account_number
      ? { label: "Account", value: result.account_number }
      : null,
    result.opening_balance !== undefined
      ? {
          label: "Opening Balance",
          value: result.opening_balance.toLocaleString(),
        }
      : null,
    result.closing_balance !== undefined
      ? {
          label: "Closing Balance",
          value: result.closing_balance.toLocaleString(),
        }
      : null,
    result.total_debits !== undefined
      ? { label: "Total Debits", value: result.total_debits.toLocaleString() }
      : null,
    result.total_credits !== undefined
      ? { label: "Total Credits", value: result.total_credits.toLocaleString() }
      : null,
    result.net_change !== undefined
      ? { label: "Net Change", value: result.net_change.toLocaleString() }
      : null,
  ].filter(Boolean) as StatItem[];

  return (
    <div className="flex flex-col gap-3">
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {result.message && (
        <div className="bg-[#E9F9EF] rounded-[10px] px-3.5 py-2.5 text-[12px] text-[#006D37] font-medium">
          ✓ {result.message}
        </div>
      )}

      {result.exceptions && result.exceptions.length > 0 && (
        <div className="bg-red-50 rounded-[10px] px-3.5 py-2.5">
          <p className="text-[12px] font-semibold text-red-600 mb-1">
            Exceptions ({result.exceptions.length})
          </p>
          <ul className="text-[11px] text-red-500 space-y-1 list-disc list-inside">
            {result.exceptions.map((ex, i) => (
              <li key={i}>{String(ex)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── Fallback stats ───────────────────────────────────────────────────────────

const FALLBACK_STATS: StatItem[] = [
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
  { label: "Duration", value: "10.2s" },
  { label: "Records Processed", value: "95" },
  { label: "API Calls Made", value: "37" },
  { label: "Status", value: "Complete", green: true },
];

<<<<<<< HEAD
export const ExecuteStep: React.FC<ExecuteStepProps> = ({
  process,
  execPhase,
=======
// ─── Download button ──────────────────────────────────────────────────────────

const DownloadButton: React.FC<{
  processName: string;
  files: File[];
}> = ({ processName, files }) => {
  const { downloadFile, isDownloading } = useFileDownload();

  const handleDownload = async () => {
    // Re-post with ?export=true — server returns a blob file instead of JSON
    const payload = buildRunProcessPayload(processName, files);
    const url = buildRunProcessUrl(true);

    // downloadFile does GET, so we call the blob POST path directly
    // by passing the URL + FormData through the same blob→link pattern
    await downloadFile(url, processName, { method: "post", data: payload });
  };

  return (
    <CustomButton
      title={isDownloading ? "Exporting..." : "Download"}
      onClick={handleDownload}
      disabled={isDownloading}
      isLoading={isDownloading}
      icon={!isDownloading ? <Download className="w-3.5 h-3.5" /> : undefined}
      textClassName="!text-[0.875rem] font-[600]"
      className="flex-1 rounded-[8px] !h-[40px] bg-white border border-[#E1E3E2] !text-[#5B5F5E] hover:bg-[#F3F3F3]"
    />
  );
};

// ─── Footer actions ───────────────────────────────────────────────────────────

const FooterActions: React.FC<{
  processName: string;
  files: File[];
  onRunAnother: () => void;
  onDashboard: () => void;
}> = ({ processName, files, onRunAnother, onDashboard }) => (
  <div className="flex flex-col gap-2 pt-3 border-t border-[#E1E3E2]">
    {/* Download row */}
    <DownloadButton processName={processName} files={files} />

    {/* Run another / Dashboard row */}
    <div className="flex gap-2.5">
      <CustomButton
        title="↻ Run Another"
        onClick={onRunAnother}
        textClassName="!text-[0.875rem] font-[600]"
        className="flex-1 rounded-[8px] !h-[40px]"
      />
      <button
        onClick={onDashboard}
        className="flex-1 bg-white border border-[#E1E3E2] text-[#5B5F5E] font-medium text-[13px] rounded-[8px] py-2.5 flex items-center justify-center gap-1.5 hover:bg-[#F3F3F3]"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const ExecuteStep: React.FC<ExecuteStepProps> = ({
  process,
  execPhase,
  result,
  files = [],
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
  onRunAnother,
  onDashboard,
}) => {
  if (execPhase === "running") {
    return <ExecutingState processTitle={process.process_name} />;
  }

<<<<<<< HEAD
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
=======
  const apiResult = result?.data?.result;

  return (
    <div className="flex flex-col gap-4">
      <SuccessHeader
        processTitle={result?.data?.process_name ?? process.process_name}
        message={result?.message}
      />

      {apiResult ? (
        <ResultDetails result={apiResult} />
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {FALLBACK_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      <FooterActions
        processName={process.process_name}
        files={files}
        onRunAnother={onRunAnother}
        onDashboard={onDashboard}
      />
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
    </div>
  );
};
