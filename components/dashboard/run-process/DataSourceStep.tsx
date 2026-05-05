"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CustomButton from "@/components/ui/custom-button";
import { API_CONNECTIONS } from "@/constants/overview";
import { SOURCE_OPTIONS } from "@/constants/data";
import { DataSourceType, Process } from "@/types/processes";
import FileUpload from "@/components/shared/Fileupload";

interface DataSourceStepProps {
  process: Process;
  dataSource: DataSourceType;
  setDataSource: (v: DataSourceType) => void;
  onContinue: (files?: File[]) => void;
}
interface ApiConnection {
  name: string;
  desc: string;
  sync: string;
  icon: string;
}

interface SourceOptionCardProps {
  option: { key: DataSourceType; icon: string; title: string; sub: string };
  isSelected: boolean;
  onSelect: () => void;
}

const SourceOptionCard: React.FC<SourceOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => (
  <button
    onClick={onSelect}
    className={cn(
      "border rounded-[12px] p-4 text-center transition-all",
      isSelected
        ? "border-[#EAA945] bg-[#EAA945]/10"
        : "border-[#E1E3E2] hover:border-[#EAA945]",
    )}
  >
    <div className="text-xl mb-2">{option.icon}</div>
    <div className="text-[13px] font-semibold text-[#0A0A0A] mb-1">
      {option.title}
    </div>
    <div className="text-[11px] text-[#9A9E9D]">{option.sub}</div>
  </button>
);

// ─── API connection card ──────────────────────────────────────────────────────

const ApiConnectionCard: React.FC<{ connection: ApiConnection }> = ({
  connection,
}) => (
  <div className="border border-[#E1E3E2] rounded-[12px] p-3.5">
    <div className="flex items-start justify-between mb-2">
      <span className="text-lg">{connection.icon}</span>
      <div className="w-9 h-5 bg-[#EAA945] rounded-full relative flex-shrink-0">
        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
      </div>
    </div>
    <p className="text-[13px] font-semibold text-[#0A0A0A] mb-1">
      {connection.name}
    </p>
    <p className="text-[11px] text-[#9A9E9D] mb-2">{connection.desc}</p>
    <span className="bg-[#D6F5E3] text-[#006D37] text-[10px] font-semibold px-2 py-0.5 rounded-full">
      Connected
    </span>
    <p className="text-[10px] text-[#9A9E9D] mt-1.5">
      Last sync: {connection.sync}
    </p>
  </div>
);

const ApiConnectionsSection: React.FC<{ connections: ApiConnection[] }> = ({
  connections,
}) => (
  <div>
    <p className="text-[14px] font-semibold mb-1">API Connections</p>
    <p className="text-[12px] text-[#9A9E9D] mb-3">
      Select integrations to pull data from. Only admin-enabled APIs are
      available.
    </p>
    <div className="grid grid-cols-2 gap-2.5">
      {connections.map((api) => (
        <ApiConnectionCard key={api.name} connection={api} />
      ))}
    </div>
  </div>
);

// ─── Info card ────────────────────────────────────────────────────────────────

const InfoCard: React.FC<{ process: Process }> = ({ process }) => (
  <div className="bg-[#EFF4FF] rounded-[10px] p-3.5 text-[13px] text-[#2E5DB0] border border-[#2E5DB0]/20 leading-relaxed">
    {process.process_name} · Daily · Input: JPEG, PDF, PNG, Arbiter 2.0, CSVs,
    Excel, CC · Output: A drafted Email and Slack notification · 3 API(s)
    available
  </div>
);

// ─── Main step ────────────────────────────────────────────────────────────────

export const DataSourceStep: React.FC<DataSourceStepProps> = ({
  process,
  dataSource,
  setDataSource,
  onContinue,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const showFileUpload = dataSource === "upload" || dataSource === "both";
  const showApiConnections = dataSource === "api" || dataSource === "both";

  const canContinue =
    dataSource === "api" ||
    (showFileUpload && selectedFiles.length > 0) ||
    (dataSource === "both" && selectedFiles.length > 0);

  return (
    <div className="flex flex-col gap-5">
      <InfoCard process={process} />

      {/* Source selection */}
      <div>
        <p className="text-[14px] font-semibold text-[#0A0A0A] mb-3">
          How would you like to provide data?
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {SOURCE_OPTIONS.map((opt) => (
            <SourceOptionCard
              key={opt.key}
              option={opt}
              isSelected={dataSource === opt.key}
              onSelect={() => {
                setDataSource(opt.key);
                // Clear files if switching away from upload
                if (opt.key === "api") setSelectedFiles([]);
              }}
            />
          ))}
        </div>
      </div>

      {/* File upload */}
      {showFileUpload && <FileUpload multiple onChange={setSelectedFiles} />}

      {/* API connections */}
      {showApiConnections && (
        <ApiConnectionsSection connections={API_CONNECTIONS} />
      )}

      {/* Continue */}
      {dataSource && (
        <CustomButton
          title="Continue"
          onClick={() =>
            onContinue(selectedFiles.length > 0 ? selectedFiles : undefined)
          }
          disabled={!canContinue}
          textClassName="!text-[0.875rem] font-[600]"
          className="w-full rounded-[12px] !h-[43px] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      )}
    </div>
  );
};
