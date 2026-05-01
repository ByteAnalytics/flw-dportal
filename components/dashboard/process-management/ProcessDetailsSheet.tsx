"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import CustomButton from "@/components/ui/custom-button";
import AlertModal from "@/components/shared/AlertModal";
import {
  useProcessById,
  useDeleteProcess,
  useAssignProcessToTeam,
} from "@/hooks/use-processes";
import { useTeams } from "@/hooks/use-teams";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  EFFORT_BADGE_STYLES,
  FREQUENCY_BADGE_STYLES,
} from "@/constants/process-management";
import { TEAM_COLORS } from "@/constants/team-management-extended";
import {
  extractErrorMessage,
  extractSuccessMessage,
  formatDate,
} from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { LOG_STATUS_STYLES } from "@/constants/activity-logs";
import ProcessSheet from "./ProcessSheet";

<<<<<<< HEAD
=======
/* eslint-disable @typescript-eslint/no-explicit-any */

>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
interface RecentExecution {
  id: string;
  user: { name: string; initials: string };
  time: string;
  status: string;
  detail?: string;
}

interface ProcessDetailsSheetProps {
  processId: string;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

const ProcessDetailsSheet: React.FC<ProcessDetailsSheetProps> = ({
  processId,
  open,
  onClose,
  onDeleted,
}) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeamSelectorOpen, setIsTeamSelectorOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useProcessById(processId);
  const deleteProcess = useDeleteProcess();
  const assignToTeam = useAssignProcessToTeam(processId); // Pass processId to the hook
  const { data: teamsData } = useTeams();

  const process = data?.data;
  const teams = teamsData?.data ?? [];

  // Cast to extended shape — your API should return these fields
  const recentExecutions: RecentExecution[] =
    (process as any)?.recent_executions ?? [];
  const notes: string = (process as any)?.notes ?? "";
  const automationTool: string = (process as any)?.automation_tool ?? "";

  const teamColor = TEAM_COLORS[process?.team_name ?? ""] ?? {
    text: "text-[#374151]",
    bg: "bg-[#F3F4F6]",
  };

  const handleDelete = async () => {
    try {
      const response = await deleteProcess.mutateAsync(
        `/processes/${processId}`,
      );
      toast.success(extractSuccessMessage(response));
      await queryClient.invalidateQueries({
        queryKey: ["processes"],
        exact: false,
        refetchType: "all",
      });
      setIsDeleteModalOpen(false);
      onDeleted?.();
      onClose();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleEditSuccess = () => {
    refetch();
    setIsEditSheetOpen(false);
  };

  const handleAssignTeam = async () => {
    if (!selectedTeamId) {
      toast.error("Please select a team");
      return;
    }

    try {
      await assignToTeam.mutateAsync({ team_id: selectedTeamId });
      toast.success("Process assigned to team successfully");
      setIsTeamSelectorOpen(false);
      setSelectedTeamId("");
      refetch(); // Refresh process details to show new team
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleUnassignTeam = async () => {
    try {
      // If you have an unassign endpoint, use a similar put request
      // For now, we'll assume assigning to null or empty string unassigns
      await assignToTeam.mutateAsync({ team_id: "" });
      toast.success("Process unassigned from team");
      refetch();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <>
      <SheetWrapper
        open={open}
        setOpen={(val) => {
          if (!val) onClose();
        }}
        title={process?.process_name ?? "Process Details"}
        description={undefined}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col h-full">
            {/* Badge row — team, frequency, effort, status */}
            <div className="flex flex-wrap items-center gap-2 mb-6 -mt-2">
              {process?.team_name && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${teamColor.bg} ${teamColor.text}`}
                >
                  {process.team_name}
                </span>
              )}
              {process?.frequency && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${FREQUENCY_BADGE_STYLES[process.frequency] ?? "bg-[#F3F4F6] text-[#374151]"}`}
                >
                  {process.frequency}
                </span>
              )}
              {process?.effort && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${EFFORT_BADGE_STYLES[process.effort] ?? "bg-[#F3F4F6] text-[#374151]"}`}
                >
                  {process.effort} effort
                </span>
              )}
              {process?.status && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${
                    process.status === "active"
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {process.status}
                </span>
              )}
            </div>

            {/* Meta grid — Point of Contact + Automation Tool */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#F3F4F6]">
              <div>
                <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider mb-2">
                  Point of Contact
                </p>
                <p className="text-[14px] font-[600] text-[#111827]">
                  {process?.point_of_contact ? (
                    process.point_of_contact
                  ) : (
                    <span className="text-[#9CA3AF]">—</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider mb-2">
                  Automation Tool
                </p>
                <p className="text-[14px] font-[600] text-[#111827]">
                  {automationTool ? (
                    automationTool
                  ) : (
                    <span className="text-[#9CA3AF]">—</span>
                  )}
                </p>
              </div>
            </div>

            {/* Team Assignment Section */}
            <div className="mb-6 pb-6 border-b border-[#F3F4F6]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider">
                  Assigned Team
                </p>
                <CustomButton
                  title={process?.team_name ? "Change Team" : "Assign Team"}
                  onClick={() => setIsTeamSelectorOpen(true)}
                  textClassName="!text-[12px] font-[600] text-[#3B82F6]"
                  className="rounded-[8px] bg-transparent hover:bg-[#EFF6FF] min-w-[90px] h-[32px]"
                />
              </div>

              {process?.team_name ? (
                <div className="flex items-center justify-between bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${teamColor.bg} ${teamColor.text}`}
                    >
                      {process.team_name}
                    </span>
                  </div>
                  <CustomButton
                    title="Unassign"
                    onClick={handleUnassignTeam}
                    textClassName="!text-[12px] font-[600] text-[#DC2626]"
                    className="rounded-[8px] bg-transparent hover:bg-[#FEF2F2] h-[32px]"
                  />
                </div>
              ) : (
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] px-4 py-3">
                  <p className="text-[13px] text-[#9CA3AF] text-center">
<<<<<<< HEAD
                    No team assigned. Click "Assign Team" to add this process to
                    a team.
=======
                    {`No team assigned. Click "Assign Team" to add this process to
                    a team.`}
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {notes && (
              <div className="mb-6 pb-6 border-b border-[#F3F4F6]">
                <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider mb-3">
                  Notes
                </p>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] px-4 py-3">
                  <p className="text-[13px] text-[#374151]">{notes}</p>
                </div>
              </div>
            )}

            {/* Recent Executions */}
            <div className="flex-1 overflow-y-auto">
              <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider mb-3">
                Recent Executions
              </p>

              {recentExecutions.length === 0 ? (
                <p className="text-[13px] text-[#9CA3AF] text-center py-8">
                  No recent executions found.
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr>
                      {["User", "Time", "Status", "Detail"].map((col) => (
                        <th
                          key={col}
                          className="text-left text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider pb-3 pr-4"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentExecutions.map((exec) => (
                      <tr key={exec.id} className="border-t border-[#F3F4F6]">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                              <span className="text-[11px] font-[700] text-[#D97706]">
                                {exec.user.initials}
                              </span>
                            </div>
                            <span className="text-[13px] font-[600] text-[#111827]">
                              {exec.user.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="text-[13px] text-[#6B7280]">
                            {formatDate(exec.time)}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${
                              LOG_STATUS_STYLES[exec.status]?.bg ??
                              "bg-[#F3F4F6]"
                            } ${
                              LOG_STATUS_STYLES[exec.status]?.text ??
                              "text-[#374151]"
                            }`}
                          >
                            {exec.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-[13px] text-[#6B7280]">
                            {exec.detail ?? "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-6 mt-auto border-t border-[#F3F4F6]">
              <CustomButton
                title="Delete"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleteProcess.isPending}
                iconPosition="left"
                withSideIcon
                sideIcon={<Trash2 size={14} />}
                textClassName="!text-[13px] font-[600] text-[#DC2626]"
                className="rounded-[8px] border border-[#FEE2E2] bg-white hover:bg-[#FEF2F2] min-w-[90px] md:h-[43px] h-[40px]"
              />

              <div className="flex items-center gap-3">
                <CustomButton
                  title="Close"
                  onClick={onClose}
                  textClassName="!text-[13px] font-[600] text-[#374151]"
                  className="rounded-[8px] border border-[#E5E7EB] bg-white hover:bg-gray-50 min-w-[80px] md:h-[43px] h-[40px]"
                />
                <CustomButton
                  title="Edit Process"
                  onClick={() => setIsEditSheetOpen(true)}
                  showIcon
                  iconPosition="left"
                  sideIcon={
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  }
                  textClassName="!text-[13px] font-[700] text-white"
                  className="rounded-[12px] border min-w-[130px] md:h-[43px] h-[40px]"
                />
              </div>
            </div>
          </div>
        )}
      </SheetWrapper>

      {/* Team Assignment Modal */}
      <AlertModal
        isOpen={isTeamSelectorOpen}
        setIsOpen={setIsTeamSelectorOpen}
        description="Select a team to assign this process to."
      >
        <div className="mt-4">
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
          >
            <option value="">Select a team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <CustomButton
            title="Cancel"
            onClick={() => {
              setIsTeamSelectorOpen(false);
              setSelectedTeamId("");
            }}
            textClassName="!text-[13px] font-[600] text-[#374151]"
            className="rounded-[8px] border border-[#E5E7EB] bg-white hover:bg-gray-50 min-w-[80px] h-[40px]"
          />
          <CustomButton
            title="Assign"
            onClick={handleAssignTeam}
            isLoading={assignToTeam.isPending}
            textClassName="!text-[13px] font-[700] text-white"
            className="rounded-[12px] border min-w-[100px] h-[40px]"
          />
        </div>
      </AlertModal>

      {/* Edit Process — nested sheet */}
      <SheetWrapper
        open={isEditSheetOpen}
        title="Edit Process"
        description="Update the details of this process."
        setOpen={setIsEditSheetOpen}
      >
        <ProcessSheet
          process={process}
          onClose={() => setIsEditSheetOpen(false)}
          onSuccess={handleEditSuccess}
        />
      </SheetWrapper>

      {/* Delete Confirmation Modal */}
      <AlertModal
        displayIcon
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        description="Are you sure you want to delete this process? This action cannot be undone."
        leftAction={{
          label: "Cancel",
          onClick: () => setIsDeleteModalOpen(false),
          className: "border-[#E5E7EB]",
        }}
        rightAction={{
          label: "Delete",
          onClick: handleDelete,
          isLoading: deleteProcess.isPending,
          className: "bg-[#DC2626] hover:bg-[#B91C1C] text-white",
        }}
      />
    </>
  );
};

export default ProcessDetailsSheet;
