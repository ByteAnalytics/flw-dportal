"use client";

import React, { useState, useMemo } from "react";
import CustomTable from "@/components/ui/custom-table";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import TabHeader from "@/components/shared/TabHeader";
import AssignModal from "@/components/shared/AssignModal";
import { useAssignModal } from "@/hooks/use-assign-modal";
import { useAssignProcessToTeam, useProcesses } from "@/hooks/use-processes";
import {
  EFFORT_BADGE_STYLES,
  FREQUENCY_BADGE_STYLES,
} from "@/constants/process-management";
import ProcessDetailsSheet from "../process-management/ProcessDetailsSheet";
import { Process } from "@/types/processes";

interface TeamDetailsProcessesTabProps {
  processes: Process[];
  teamId: string;
  onProcessUpdated?: () => void;
}

const BadgeSpan: React.FC<{
  label: string;
  styles: Record<string, string>;
  value: string;
}> = ({ label, styles, value }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${
      styles[value] ?? "bg-[#F3F4F6] text-[#374151]"
    }`}
  >
    {label}
  </span>
);

const processTableColumns = [
  { key: "name", label: "Process Name" },
  { key: "frequency", label: "Frequency" },
  { key: "effort", label: "Effort" },
  { key: "status", label: "Status" },
];

const TeamDetailsProcessesTab: React.FC<TeamDetailsProcessesTabProps> = ({
  processes,
  teamId,
  onProcessUpdated,
}) => {
  const [selectedProcessForDetails, setSelectedProcessForDetails] = useState<
    string | null
  >(null);

  const modal = useAssignModal({
    invalidateKeys: [["teams", teamId], ["processes"]],
    onSuccess: onProcessUpdated,
    successMessage: "Process assigned to team successfully",
    errorMessage: "Failed to assign process",
    validationMessage: "Please select a process",
  });

  const { data: processesData, isLoading: processesLoading } = useProcesses();
  const assignProcessToTeam = useAssignProcessToTeam(modal.selectedId);

  const availableProcesses =
    processesData?.data?.filter(
      (p) => !processes.some((tp) => tp.id === p.id),
    ) ?? [];

  const processOptions = availableProcesses.map((p) => ({
    value: p.id,
    label: p.process_name,
  }));

  const rows = useMemo(
    () =>
      processes.map((process) => ({
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
        frequency: (
          <BadgeSpan
            label={process.frequency}
            styles={FREQUENCY_BADGE_STYLES}
            value={process.frequency}
          />
        ),
        effort: (
          <BadgeSpan
            label={process.effort}
            styles={EFFORT_BADGE_STYLES}
            value={process.effort}
          />
        ),
        status: <StatusBadge status={process.status} />,
      })),
    [processes],
  );

  return (
    <>
      <TabHeader
        title="Assigned Processes"
        count={processes.length}
        actionLabel="Assign Process"
        onAction={modal.open}
      />

      {processes.length === 0 ? (
        <EmptyState
          message="No processes assigned to this team yet."
          actionLabel="+ Assign Process"
          onAction={modal.open}
        />
      ) : (
        <CustomTable
          columns={processTableColumns}
          rows={rows}
          loading={false}
          isActionOnRow={true}
        />
      )}

      <AssignModal
        isOpen={modal.isOpen}
        setIsOpen={modal.setIsOpen}
        description="Select a process to assign to this team."
        isLoading={processesLoading}
        isPending={assignProcessToTeam.isPending}
        options={processOptions}
        selectedValue={modal.selectedId}
        onSelectChange={modal.setSelectedId}
        onConfirm={() =>
          modal.submit(() =>
            assignProcessToTeam.mutateAsync({ team_id: teamId }),
          )
        }
        onCancel={modal.reset}
        confirmLabel="Assign"
        emptyMessage="No available processes to assign."
      />

      {selectedProcessForDetails && (
        <ProcessDetailsSheet
          processId={selectedProcessForDetails}
          open={!!selectedProcessForDetails}
          onClose={() => setSelectedProcessForDetails(null)}
        />
      )}
    </>
  );
};

export default TeamDetailsProcessesTab;
