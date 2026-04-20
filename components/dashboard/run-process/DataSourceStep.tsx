"use client";

import React from "react";
import { cn } from "@/lib/utils";
import CustomButton from "@/components/ui/custom-button";
import { API_CONNECTIONS} from "@/constants/overview";
import { SOURCE_OPTIONS } from "@/constants/data";
import { DataSourceType, Process } from "@/types/processes";

interface DataSourceStepProps {
  process: Process;
  dataSource: DataSourceType;
  setDataSource: (v: DataSourceType) => void;
  onContinue: () => void;
}

// Types
interface ApiConnection {
  name: string;
  desc: string;
  sync: string;
  icon: string;
}

// Reusable Source Option Card Component
interface SourceOptionCardProps {
  option: {
    key: DataSourceType;
    icon: string;
    title: string;
    sub: string;
  };
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
        ? "border-[#006D37] bg-[#FFFBF0]"
        : "border-[#E1E3E2] bg-white hover:border-[#006D37]",
    )}
  >
    <div className="text-xl mb-2">{option.icon}</div>
    <div className="text-[13px] font-semibold text-[#0A0A0A] mb-1">
      {option.title}
    </div>
    <div className="text-[11px] text-[#9A9E9D]">{option.sub}</div>
  </button>
);

// Reusable File Upload Component
interface FileUploadProps {
  acceptedFormats?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedFormats = "JPEG, PDF, PNG, Arbiter 2.0, CSVs, Excel, CC",
}) => (
  <div>
    <p className="text-[14px] font-semibold mb-2.5">Upload Files</p>
    <div className="border-2 border-dashed border-[#D1D5DB] rounded-[12px] p-7 text-center bg-[#FAFAFA]">
      <svg
        className="w-9 h-9 mx-auto mb-2.5 text-[#C0C4C3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
      </svg>
      <p className="text-[13px] text-[#9A9E9D] mb-3">
        Drag and drop files, or click to browse
      </p>
      <div className="flex items-center justify-center gap-3">
        <button className="bg-white border border-[#E1E3E2] rounded-[8px] px-3.5 py-1.5 text-[12px] font-medium text-[#5B5F5E] hover:bg-[#F3F3F3]">
          Choose Files
        </button>
        <span className="text-[12px] text-[#9A9E9D]">No file chosen</span>
      </div>
      <p className="text-[11px] text-[#9A9E9D] mt-3">
        Accepted: {acceptedFormats}
      </p>
    </div>
  </div>
);

// Reusable API Connection Card Component
interface ApiConnectionCardProps {
  connection: ApiConnection;
}

const ApiConnectionCard: React.FC<ApiConnectionCardProps> = ({
  connection,
}) => (
  <div className="border border-[#E1E3E2] rounded-[12px] p-3.5">
    <div className="flex items-start justify-between mb-2">
      <span className="text-lg">{connection.icon}</span>
      <div className="w-9 h-5 bg-[#006D37] rounded-full relative flex-shrink-0">
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

// Reusable API Connections Section Component
interface ApiConnectionsProps {
  connections: ApiConnection[];
}

const ApiConnectionsSection: React.FC<ApiConnectionsProps> = ({
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

// Reusable Info Card Component
interface InfoCardProps {
  process: Process;
}

const InfoCard: React.FC<InfoCardProps> = ({ process }) => (
  <div className="bg-[#EFF4FF] rounded-[10px] p-3.5 text-[12px] text-[#2E5DB0] leading-relaxed">
    {process.process_name} · Daily · Input: JPEG, PDF, PNG, Arbiter 2.0, CSVs, Excel,
    CC · Output: A drafted Email and Slack notification · 3 API(s) available
  </div>
);

export const DataSourceStep: React.FC<DataSourceStepProps> = ({
  process,
  dataSource,
  setDataSource,
  onContinue,
}) => {
  const showFileUpload = dataSource === "upload" || dataSource === "both";
  const showApiConnections = dataSource === "api" || dataSource === "both";

  return (
    <div className="flex flex-col gap-5">
      {/* Info Card */}
      <InfoCard process={process} />

      {/* Source Options Section */}
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
              onSelect={() => setDataSource(opt.key)}
            />
          ))}
        </div>
      </div>

      {/* Conditional Sections */}
      {showFileUpload && <FileUpload />}
      {showApiConnections && (
        <ApiConnectionsSection connections={API_CONNECTIONS} />
      )}

      {/* Continue Button */}
      {dataSource && (
        <CustomButton
          title="Continue"
          onClick={onContinue}
          textClassName="!text-[0.875rem] font-[600]"
          className="w-full rounded-[12px] !h-[45px] bg-[#006D37] hover:bg-[#D4911A]"
        />
      )}
    </div>
  );
};
