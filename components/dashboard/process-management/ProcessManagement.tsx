"use client";

import React, { useMemo } from "react";
import { Eye } from "lucide-react";
import CustomTable from "@/components/ui/custom-table";
import CustomButton from "@/components/ui/custom-button";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import {
  processTableColumns,
  EFFORT_BADGE_STYLES,
  FREQUENCY_BADGE_STYLES,
} from "@/constants/process-management";
import { TEAM_COLORS } from "@/constants/team-management-extended";
import ProcessSheet from "./ProcessSheet";
import ProcessDetailsSheet from "./ProcessDetailsSheet";
import { FilterDropdown } from "@/components/dashboard/run-process/Filterdropdown";
import { DropdownItem } from "@/components/ui/custom-dropdown";
import { Button } from "@/components/ui/button";
import { useProcessManagement } from "@/hooks/use-processes";

const EFFORT_OPTIONS = ["Low", "Medium", "High"];
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Quarterly"];

const TeamBadge: React.FC<{ name: string }> = ({ name }) => {
  const c = TEAM_COLORS[name] ?? { text: "text-[#374151]", bg: "bg-[#F3F4F6]" };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${c.bg} ${c.text}`}
    >
      {name}
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${
      status === "active"
        ? "bg-[#DCFCE7] text-[#166534]"
        : "bg-[#F3F4F6] text-[#6B7280]"
    }`}
  >
    {status}
  </span>
);

const ProcessManagement = () => {
  const {
    isSheetOpen,
    setIsSheetOpen,
    selectedProcess,
    selectedProcessId,
    setSelectedProcessId,
    search,
    setSearch,
    teamFilter,
    setTeamFilter,
    effortFilter,
    setEffortFilter,
    frequencyFilter,
    setFrequencyFilter,
    data,
    isLoading,
    teamFilterOptions,
    hasActiveFilters,
    resetFilters,
    handleAddProcess,
  } = useProcessManagement();

  const teamDropdownItems: DropdownItem[] = teamFilterOptions.map((o) => ({
    label: o.label,
    onClick: () => setTeamFilter(o.value),
  }));

  const effortDropdownItems: DropdownItem[] = [
    { label: "All Effort", onClick: () => setEffortFilter("") },
    ...EFFORT_OPTIONS.map((e) => ({
      label: e,
      onClick: () => setEffortFilter(e),
    })),
  ];

  const frequencyDropdownItems: DropdownItem[] = [
    { label: "All Frequency", onClick: () => setFrequencyFilter("") },
    ...FREQUENCY_OPTIONS.map((f) => ({
      label: f,
      onClick: () => setFrequencyFilter(f),
    })),
  ];

  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((process) => ({
      name: (
        <div>
          <p className="text-[13px] font-[600] text-[#111827]">
            {process.process_name}
          </p>
          {process.description && (
            <p className="text-[12px] text-[#9CA3AF] mt-0.5 truncate max-w-[320px]">
              {process.description}
            </p>
          )}
        </div>
      ),
      team: <TeamBadge name={process.team_name} />,
      frequency: (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${FREQUENCY_BADGE_STYLES[process.frequency] ?? "bg-[#F3F4F6] text-[#374151]"}`}
        >
          {process.frequency}
        </span>
      ),
      effort: (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${EFFORT_BADGE_STYLES[process.effort] ?? "bg-[#F3F4F6] text-[#374151]"}`}
        >
          {process.effort}
        </span>
      ),
      apis: (
        <div className="flex items-center gap-1">
          {process?.apis?.map((api) => (
            <span
              key={api.id}
              title={api.name}
              className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[10px] font-bold text-[#374151]"
            >
              {api.name[0]}
            </span>
          ))}
        </div>
      ),
      status: <StatusBadge status={process.status} />,
      actions: (
        <button
          onClick={() => setSelectedProcessId(process.id)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="View process"
        >
          <Eye size={16} className="text-[#6B7280]" />
        </button>
      ),
    }));
  }, [data, setSelectedProcessId]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-3">
        <div>
          <h2 className="text-[1.5rem] font-[700] text-[#111827]">
            Process Management
          </h2>
          <p className="font-[500] text-sm text-[#6B7280] mt-1">
            Create, manage, and assign processes to teams
          </p>
        </div>

        <SheetWrapper
          open={isSheetOpen}
          title={selectedProcess ? "Edit Process" : "New Process"}
          description={
            selectedProcess
              ? "Update the details of this process."
              : "Fill in the details to create a new automated process."
          }
          setOpen={setIsSheetOpen}
          trigger={
            <CustomButton
              onClick={handleAddProcess}
              title="+ New Process"
              textClassName="md:text-[13px] text-[12px] font-[700] text-white"
              className="min-w-[140px] rounded-[12px] border md:h-[43px] h-[41px]"
            />
          }
        >
          <ProcessSheet
            process={selectedProcess}
            onClose={() => setIsSheetOpen(false)}
          />
        </SheetWrapper>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[16px] border border-[#F3F4F6] p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search processes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-[280px] h-[40px] border border-[#E5E7EB] rounded-[10px] px-3 text-[13px] text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#006F37]"
        />

        <FilterDropdown
          label={
            teamFilterOptions.find((o) => o.value === teamFilter)?.label ??
            "All Teams"
          }
          items={teamDropdownItems}
        />

        <FilterDropdown
          label={effortFilter || "All Effort"}
          items={effortDropdownItems}
        />

        <FilterDropdown
          label={frequencyFilter || "All Frequency"}
          items={frequencyDropdownItems}
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

      {/* Table */}
      <CustomTable
        columns={processTableColumns}
        rows={rows}
        loading={isLoading}
        isActionOnRow={true}
      />

      {/* Process Details Sheet */}
      {selectedProcessId && (
        <ProcessDetailsSheet
          processId={selectedProcessId}
          open={!!selectedProcessId}
          onClose={() => setSelectedProcessId(null)}
          onDeleted={() => setSelectedProcessId(null)}
        />
      )}
    </div>
  );
};

export default ProcessManagement;
