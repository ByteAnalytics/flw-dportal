"use client";

import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import CustomTable from "@/components/ui/custom-table";
import EmptyState from "@/components/shared/EmptyState";
import TabHeader from "@/components/shared/TabHeader";
import AssignModal from "@/components/shared/AssignModal";
import AvatarInitials from "@/components/shared/AvatarInitials";
import { useUsers } from "@/hooks/use-users";
import { useAddUserToTeam, useRemoveUserFromTeam } from "@/hooks/use-teams";
import { useAssignModal } from "@/hooks/use-assign-modal";
import { getStatusBadge } from "@/components/shared/Badge";

interface MembersTabProps {
  members: any[];
  teamId: string;
  onMemberUpdated?: () => void;
}

const memberTableColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "lastLogin", label: "Last Login" },
  { key: "actions", label: "" },
];

const TeamDetailsMembersTab: React.FC<MembersTabProps> = ({
  members,
  teamId,
  onMemberUpdated,
}) => {
  const queryClient = useQueryClient();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const modal = useAssignModal({
    invalidateKeys: [["teams", teamId]],
    onSuccess: onMemberUpdated,
    successMessage: "User added to team successfully",
    errorMessage: "Failed to add user to team",
    validationMessage: "Please select a user",
  });

  const { data: usersData, isLoading: usersLoading } = useUsers();
  const addUserToTeam = useAddUserToTeam(teamId, modal.selectedId);
  const removeUserFromTeam = useRemoveUserFromTeam(teamId, removingId ?? "");

  const availableUsers =
    usersData?.data?.filter(
      (user) => !members.some((member) => member.id === user.id),
    ) ?? [];

  const userOptions = availableUsers.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name} (${user.email})`,
  }));

  const handleRemoveMember = async (memberId: string) => {
    setRemovingId(memberId);
    try {
      await removeUserFromTeam.mutateAsync(null);
      toast.success("Member removed from team");
      await queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      onMemberUpdated?.();
    } catch (error: any) {
      toast.error("Failed to remove member from team");
    } finally {
      setRemovingId(null);
    }
  };

  const rows = useMemo(
    () =>
      members.map((member) => ({
        name: (
          <div className="flex items-center gap-2">
            <AvatarInitials
              firstName={member.first_name}
              lastName={member.last_name}
            />
            <span className="text-[13px] font-[600] text-[#111827]">
              {member.first_name} {member.last_name}
            </span>
          </div>
        ),
        email: (
          <span className="text-[13px] text-[#6B7280]">{member.email}</span>
        ),
        status: getStatusBadge(member.is_active),
        lastLogin: (
          <span className="text-[13px] text-[#9CA3AF]">
            {member.last_login ? formatDate(member.last_login) : "—"}
          </span>
        ),
        actions: (
          <button
            onClick={() => handleRemoveMember(member.id)}
            disabled={removingId === member.id}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-[#DC2626] disabled:opacity-40 disabled:cursor-not-allowed"
            title="Remove member from team"
          >
            {removingId === member.id ? (
              <span className="w-[14px] h-[14px] border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <X size={14} />
            )}
          </button>
        ),
      })),
    [members, removingId],
  );

  return (
    <>
      <TabHeader
        title="Team Members"
        count={members.length}
        actionLabel="Add Member"
        onAction={modal.open}
      />

      {members.length === 0 ? (
        <EmptyState
          message="No members in this team yet."
          actionLabel="Add a Member"
          onAction={modal.open}
        />
      ) : (
        <CustomTable
          columns={memberTableColumns}
          rows={rows}
          loading={false}
          isActionOnRow={true}
        />
      )}

      <AssignModal
        isOpen={modal.isOpen}
        setIsOpen={modal.setIsOpen}
        description="Select a user to add to this team."
        isLoading={usersLoading}
        isPending={addUserToTeam.isPending}
        options={userOptions}
        selectedValue={modal.selectedId}
        onSelectChange={modal.setSelectedId}
        onConfirm={() => modal.submit(() => addUserToTeam.mutateAsync(null))}
        onCancel={modal.reset}
        confirmLabel="Add Member"
        emptyMessage="No available users to add."
      />
    </>
  );
};

export default TeamDetailsMembersTab;
