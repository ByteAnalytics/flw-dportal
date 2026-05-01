"use client";

<<<<<<< HEAD
=======
import React, { useState } from "react";
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
import { Search } from "lucide-react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import { Button } from "@/components/ui/button";
import { DropdownItem } from "@/components/ui/custom-dropdown";
import { STATUS_OPTIONS } from "@/constants/overview";
import { useProcessManagement } from "@/hooks/use-processes";
<<<<<<< HEAD
import {
  Process,
  ProcessApi,
  ProcessEffort,
  ProcessStatus,
} from "@/types/processes";
=======
import { ProcessApi, ProcessEffort, ProcessStatus } from "@/types/processes";
import { RunProcessResponse } from "@/hooks/use-run-process";
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
import { FilterDropdown } from "./Filterdropdown";
import { DataSourceStep } from "./DataSourceStep";
import { ConfigureStep } from "./ConfigureStep";
import { ExecuteStep } from "./ExecuteStep";
import { StepTabs } from "@/components/dashboard/run-process/StepTabs";
import { ProcessCard } from "../overview/ProcessCard";

const PLACEHOLDER_EXTRAS: Record<
  string,
  {
    category: string;
    categoryType: string;
    icons: string[];
    inputs: string;
    description: string;
    team_name: string;
    team_id: string;
    is_assigned: boolean;
    effort: ProcessEffort;
    status: ProcessStatus;
    apis: ProcessApi[];
    point_of_contact?: string;
  }
> = {
  default: {
    category: "Chargeback",
    categoryType: "chargeback",
    icons: ["shield", "card"],
    inputs: "RRN, JPEG, PNG, CP",
    description:
      "Finding transactions singly on CP and generating evidence for successful transactions which takes up to a minute per transaction...",
    team_name: "Chargeback Team",
    team_id: "team-1",
    is_assigned: true,
    effort: "High",
    status: "active",
    apis: [],
    point_of_contact: "Chargeback Team Lead",
  },
};

const getPlaceholderExtras = (processId: string) =>
  PLACEHOLDER_EXTRAS[processId] ?? PLACEHOLDER_EXTRAS.default;

const RunProcess = () => {
  const {
    isSheetOpen,
<<<<<<< HEAD
    setIsSheetOpen,
=======
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
    selectedProcess,
    step,
    setStep,
    dataSource,
    setDataSource,
    execPhase,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    processes,
    isLoading,
    hasActiveFilters,
    resetFilters,
    handleRun,
    handleSheetClose,
    startExecute,
    handleRunAnother,
    handleDashboard,
  } = useProcessManagement({ withRunFlow: true });

<<<<<<< HEAD
  // client-side category filter — API doesn't support it yet
=======
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [runResult, setRunResult] = useState<RunProcessResponse | null>(null);

  const handleExecuteComplete = (result: RunProcessResponse) => {
    setRunResult(result);
    startExecute();
    setStep("execute");
  };

  const handleRunAnotherWithReset = () => {
    setRunResult(null);
    setUploadedFiles([]);
    handleRunAnother();
  };

>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
  const filteredProcesses = processes.filter((p) => {
    if (selectedCategory === "all") return true;
    return getPlaceholderExtras(p.id).categoryType === selectedCategory;
  });

  const statusDropdownItems: DropdownItem[] = STATUS_OPTIONS.map((stat) => ({
    label: stat.label,
    onClick: () => setSelectedStatus(stat.value as ProcessStatus),
  }));

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-[1.4rem] font-bold text-gray-900">Run a Process</h1>
        <p className="text-InfraMuted font-[500] text-sm mt-0.5">
          Click a process card to select it, then configure and execute
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-2">
        <div className="flex items-center gap-2 h-[40px] flex-1 border border-InfraBorder bg-white rounded-[8px] px-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by process name or description"
            className="w-full font-semibold bg-white text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>

        <FilterDropdown
          label={
            STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label ??
            "All Status"
          }
          items={statusDropdownItems}
        />

        {hasActiveFilters && (
          <Button
            onClick={resetFilters}
            variant="ghost"
            className="h-[40px] text-gray-500 hover:text-gray-700"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        {isLoading ? (
          <span className="text-gray-400">Loading processes...</span>
        ) : (
          <span>
            Showing {filteredProcesses.length} of {processes.length} processes
          </span>
        )}
      </div>

      {/* Process Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[180px] rounded-lg bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : filteredProcesses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No processes match your filters</p>
          <Button onClick={resetFilters} variant="outline" className="mt-3">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProcesses.map((p) => (
            <ProcessCard
              key={p.id}
              process={{ ...p, ...getPlaceholderExtras(p.id) }}
              onRun={() => handleRun(p.id)}
            />
          ))}
        </div>
      )}

      {/* Sheet */}
      {selectedProcess && (
        <SheetWrapper
          title={selectedProcess.process_name}
          open={isSheetOpen}
          setOpen={handleSheetClose}
<<<<<<< HEAD
          SheetContentClassName="sm:max-w-[500px] mb-4"
=======
          SheetContentClassName="sm:max-w-[500px] mb-4 px-0 bg-white"
          headerClassName="px-4"
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
        >
          <div className="flex flex-col h-full pb-4">
            <span className="bg-[#E8F0FF] w-fit text-[#2E5DB0] text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block mb-4">
              {selectedProcess.frequency}
            </span>

            <StepTabs step={step} onStepClick={setStep} />

<<<<<<< HEAD
            <div className="flex-1 pt-5 pb-[1.5rem]">
=======
            <div className="flex-1 pt-5 pb-[1.5rem] px-4">
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
              {step === "datasource" && (
                <DataSourceStep
                  process={selectedProcess}
                  dataSource={dataSource}
                  setDataSource={setDataSource}
<<<<<<< HEAD
                  onContinue={() => setStep("configure")}
                />
              )}
=======
                  onContinue={(files) => {
                    if (files) setUploadedFiles(files);
                    setStep("configure");
                  }}
                />
              )}

>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
              {step === "configure" && (
                <ConfigureStep
                  process={selectedProcess}
                  dataSource={dataSource}
<<<<<<< HEAD
                  onBack={() => setStep("datasource")}
                  onExecute={startExecute}
                />
              )}
=======
                  files={uploadedFiles}
                  onBack={() => setStep("datasource")}
                  onExecute={handleExecuteComplete}
                />
              )}

>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
              {step === "execute" && (
                <ExecuteStep
                  process={selectedProcess}
                  execPhase={execPhase}
<<<<<<< HEAD
                  onRunAnother={handleRunAnother}
=======
                  result={runResult}
                  files={uploadedFiles}
                  onRunAnother={handleRunAnotherWithReset}
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
                  onDashboard={handleDashboard}
                />
              )}
            </div>
          </div>
        </SheetWrapper>
      )}
    </div>
  );
};

export default RunProcess;
