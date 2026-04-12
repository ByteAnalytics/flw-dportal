"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import { Button } from "@/components/ui/button";
import { DropdownItem } from "@/components/ui/custom-dropdown";

import {
  DataSourceType,
  PanelStep,
  ExecPhase,
  ProcessCategory,
  ProcessStatus,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from "@/constants/overview";
import { FilterDropdown } from "./Filterdropdown";
import { DataSourceStep } from "./DataSourceStep";
import { ConfigureStep } from "./ConfigureStep";
import { ExecuteStep } from "./ExecuteStep";
import { Process } from "@/types";
import { filterProcesses } from "@/lib/overview";
import { PROCESSES } from "@/constants/data";
import { ProcessCard } from "../overview/ProcessCard";
import {StepTabs} from "@/components/dashboard/run-process/StepTabs";

const RunProcess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [step, setStep] = useState<PanelStep>("datasource");
  const [dataSource, setDataSource] = useState<DataSourceType>(null);
  const [execPhase, setExecPhase] = useState<ExecPhase>("idle");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProcessCategory>("all");
  const [selectedStatus, setSelectedStatus] = useState<ProcessStatus>("all");

  const filteredProcesses = filterProcesses(
    PROCESSES,
    search,
    selectedCategory,
    selectedStatus,
  );

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  useEffect(() => {
    if (idParam) {
      const found = PROCESSES.find((p) => p.id === Number(idParam));
      if (found) {
        setSelectedProcess(found);
        setStep("datasource");
        setDataSource(null);
        setExecPhase("idle");
        setIsSheetOpen(true);
      }
    }
  }, [idParam]);

  const handleRun = (id?: number) => {
    const found = PROCESSES.find((p) => p.id === id);
    if (!found) return;
    setSelectedProcess(found);
    setStep("datasource");
    setDataSource(null);
    setExecPhase("idle");
    setIsSheetOpen(true);
    router.push(`/dashboard/run-process?id=${id}`, { scroll: false });
  };

  const handleSheetClose = useCallback(
    (open: boolean) => {
      setIsSheetOpen(open);
      if (!open) router.push("/dashboard/run-process", { scroll: false });
    },
    [router],
  );

  const startExecute = useCallback(() => {
    setStep("execute");
    setExecPhase("running");
    setTimeout(() => setExecPhase("done"), 3200);
  }, []);

  const handleRunAnother = () => {
    setStep("datasource");
    setDataSource(null);
    setExecPhase("idle");
    setIsSheetOpen(false);
    router.push("/dashboard/run-process", { scroll: false });
  };

  const handleDashboard = () => {
    setIsSheetOpen(false);
    router.push("/dashboard");
  };

  const categoryDropdownItems: DropdownItem[] = CATEGORY_OPTIONS.map((cat) => ({
    label: cat.label,
    onClick: () => setSelectedCategory(cat.value as ProcessCategory),
  }));

  const statusDropdownItems: DropdownItem[] = STATUS_OPTIONS.map((stat) => ({
    label: stat.label,
    onClick: () => setSelectedStatus(stat.value as ProcessStatus),
  }));

  const hasActiveFilters =
    search || selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-[1.4rem] font-bold text-gray-900">Run a Process</h1>
        <p className="text-InfraMuted font-[500] text-sm mt-0.5">
          Click a process card to select it, then configure and execute
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#F7F7F7] p-2">
        <div className="flex items-center gap-2 h-[40px] flex-1 border border-InfraBorder bg-background rounded-[8px] px-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by process name or description"
            className="w-full font-semibold bg-background text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>

        <FilterDropdown
          label={
            CATEGORY_OPTIONS.find((c) => c.value === selectedCategory)?.label ??
            "All Categories"
          }
          items={categoryDropdownItems}
        />

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
        Showing {filteredProcesses.length} of {PROCESSES.length} processes
      </div>

      {/* Process Grid */}
      {filteredProcesses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No processes match your filters</p>
          <Button onClick={resetFilters} variant="outline" className="mt-3">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProcesses.map((p) => (
            <ProcessCard key={p.id} process={p} onRun={handleRun} />
          ))}
        </div>
      )}

      {/* Sheet */}
      {selectedProcess && (
        <SheetWrapper
          title={selectedProcess.title}
          open={isSheetOpen}
          setOpen={handleSheetClose}
          SheetContentClassName="sm:max-w-[500px] mb-4"
        >
          <div className="flex flex-col h-full pb-4">
            <span className="bg-[#E8F0FF] w-fit text-[#2E5DB0] text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block mb-4">
              {selectedProcess.frequency}
            </span>

            <StepTabs step={step} onStepClick={setStep} />

            <div className="flex-1 pt-5 pb-[1.5rem]">
              {step === "datasource" && (
                <DataSourceStep
                  process={selectedProcess}
                  dataSource={dataSource}
                  setDataSource={setDataSource}
                  onContinue={() => setStep("configure")}
                />
              )}
              {step === "configure" && (
                <ConfigureStep
                  process={selectedProcess}
                  dataSource={dataSource}
                  onBack={() => setStep("datasource")}
                  onExecute={startExecute}
                />
              )}
              {step === "execute" && (
                <ExecuteStep
                  process={selectedProcess}
                  execPhase={execPhase}
                  onRunAnother={handleRunAnother}
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
