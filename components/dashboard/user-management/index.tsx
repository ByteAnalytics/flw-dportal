/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import CustomTable from "@/components/ui/custom-table";
import CustomButton from "@/components/ui/custom-button";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import { getRoleBadge, getStatusBadge } from "@/components/shared/Badge";
import AvatarInitials from "@/components/shared/AvatarInitials";
import EmptyState from "@/components/shared/EmptyState";
import {
  userManagementColumns,
  TEAM_COLORS,
} from "@/constants/team-management-extended";
import { UserWithTeams } from "@/types/teams";
import { formatDate } from "@/lib/utils";
import { useTeams } from "@/hooks/use-teams";
import { useUsers } from "@/hooks/use-users";
import { useDebounce } from "@/hooks/use-debounce";
import OnboardUserSheet from "./OnboardUserSheet";
import UserSheet from "./UserSheet";
import { FilterDropdown } from "@/components/dashboard/run-process/Filterdropdown";
import { DropdownItem } from "@/components/ui/custom-dropdown";

const TeamBadge: React.FC<{ name: string }> = ({ name }) => {
  const { text = "text-[#374151]", bg = "bg-[#F3F4F6]" } =
    TEAM_COLORS[name] ?? {};
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${bg} ${text}`}
    >
      {name}
    </span>
  );
};

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#6B7280]"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const statusFilterToParams = (status: string) => ({
  ...(status === "active" && { is_active: true }),
  ...(status === "inactive" && { is_active: false }),
});

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const UserManagement = () => {
  const [isOnboardSheetOpen, setIsOnboardSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithTeams | null>(null);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useUsers({
    team_name: debouncedSearch,
    team_id: teamFilter,
    ...statusFilterToParams(statusFilter),
  });

  const { data: teamsData } = useTeams();

  const teamFilterOptions = useMemo(
    () => [
      { label: "All Teams", value: "" },
      ...(teamsData?.data.map((t) => ({ label: t.name, value: t.id })) ?? []),
    ],
    [teamsData],
  );

  const teamDropdownItems: DropdownItem[] = teamFilterOptions.map((o) => ({
    label: o.label,
    onClick: () => setTeamFilter(o.value),
  }));

  const statusDropdownItems: DropdownItem[] = STATUS_OPTIONS.map((o) => ({
    label: o.label,
    onClick: () => setStatusFilter(o.value),
  }));

  const handleEdit = useCallback((user: UserWithTeams) => {
    setSelectedUser(user);
    setIsEditSheetOpen(true);
  }, []);

  const rows = useMemo(() => {
    const validUsers = (data?.data ?? []).filter(
      (u): u is UserWithTeams => !!u,
    );

    return validUsers.map((user) => ({
      user: (
        <div className="flex items-center gap-2">
          <AvatarInitials
            firstName={user.first_name}
            lastName={user.last_name}
          />
          <span className="text-[13px] font-[600] text-[#111827]">
            {`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "—"}
          </span>
        </div>
      ),
      email: (
        <span className="text-[13px] text-[#6B7280]">{user.email || "—"}</span>
      ),
      role: user.role ? (
        getRoleBadge(user.role)
      ) : (
        <span className="text-[13px] text-[#9CA3AF]">—</span>
      ),
      team: (
        <div className="flex flex-wrap gap-1">
          {!user.teams?.length ? (
            <span className="text-[13px] text-[#9CA3AF]">—</span>
          ) : (
            user.teams
              .filter((t) => t?.name)
              .map((t) => <TeamBadge key={t.id} name={t.name} />)
          )}
        </div>
      ),
      status: user.status ? (
        getStatusBadge(user.status)
      ) : (
        <span className="text-[13px] text-[#9CA3AF]">—</span>
      ),
      lastLogin: (
        <span className="text-[13px] text-[#6B7280]">
          {user.last_login ? formatDate(user.last_login) : "—"}
        </span>
      ),
      actions: (
        <button
          onClick={() => handleEdit(user)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Edit user"
        >
          <EditIcon />
        </button>
      ),
    }));
  }, [data, handleEdit]);

  return (
    <div>
      <div className="flex justify-between items-start mb-8 flex-wrap gap-3">
        <div>
          <h2 className="text-[1.5rem] font-[700] text-[#111827]">
            User Management
          </h2>
          <p className="font-[500] text-sm text-[#6B7280] mt-1">
            Onboard users and assign them to teams
          </p>
        </div>
        <SheetWrapper
          open={isOnboardSheetOpen}
          title="Onboard New User"
          description="Fill in the details to create a new user account. A temporary password will be sent to their email."
          setOpen={setIsOnboardSheetOpen}
          trigger={
            <CustomButton
              onClick={() => setIsOnboardSheetOpen(true)}
              title="Onboard User"
              showIcon
              textClassName="md:text-[13px] text-[12px] font-[700] text-white"
              className="min-w-[140px] rounded-[12px] border md:h-[43px] h-[41px]"
            />
          }
        >
          <OnboardUserSheet onClose={() => setIsOnboardSheetOpen(false)} />
        </SheetWrapper>
      </div>

      <div className="bg-white rounded-[16px] border border-[#F3F4F6] p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-[320px] h-[40px] border border-[#E5E7EB] rounded-[10px] px-3 text-[13px] text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#006F37]"
        />

        <FilterDropdown
          label={
            teamFilterOptions.find((o) => o.value === teamFilter)?.label ??
            "All Teams"
          }
          items={teamDropdownItems}
        />

        <FilterDropdown
          label={
            STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ??
            "All Status"
          }
          items={statusDropdownItems}
        />
      </div>

      {!isLoading && !data?.data?.length ? (
        <EmptyState
          message="No users found"
          actionLabel="Onboard Your First User"
          onAction={() => setIsOnboardSheetOpen(true)}
        />
      ) : (
        <CustomTable
          columns={userManagementColumns}
          rows={rows}
          loading={isLoading}
          isActionOnRow={true}
        />
      )}

      <SheetWrapper
        open={isEditSheetOpen}
        title="Edit User"
        description="Edit user details. The system will notify them of any changes."
        setOpen={setIsEditSheetOpen}
      >
        <UserSheet
          user={selectedUser as any}
          onClose={() => setIsEditSheetOpen(false)}
          onSuccess={() => setIsEditSheetOpen(false)}
        />
      </SheetWrapper>
    </div>
  );
};

export default UserManagement;
