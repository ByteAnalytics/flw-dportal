"use client";

import React, { useState, useMemo } from "react";
import CustomTable from "@/components/ui/custom-table";
import CustomButton from "@/components/ui/custom-button";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { MoreVertical } from "lucide-react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import UserSheet from "./UserSheet";
import { useRouter } from "nextjs-toploader/app";
import { getRoleBadge, getStatusBadge } from "@/components/shared/Badge";
import { usersTableColumns } from "@/constants/team-management";
import { useGet } from "@/hooks/use-queries";
import { TeamUsersResponse } from "@/types/team-management";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";

const ManageUsersTable = () => {
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const { data, isLoading } = useGet<TeamUsersResponse>(["users"], "/users/");

  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((user) => ({
      name: `${user.first_name} ${user.last_name}`,
      lastLogin: formatDate(user.last_login),
      email: user.email,
      role: getRoleBadge(user.role),
      status: getStatusBadge(user.status),
      actions: (
        <CustomDropdown
          trigger={
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <MoreVertical size={18} className="text-[#444846]" />
            </button>
          }
          items={[
            {
              label: "Edit",
              onClick: () => handleEdit(user),
            },
            {
              label: "View Info",
              onClick: () =>
                router.push(`/dashboard/team-management/user/${user.id}`),
            },
          ]}
        />
      ),
    }));
  }, [data]);

  const handleEdit = (user: User) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setIsUserSheetOpen(true);
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setIsUserSheetOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="md:text-[1.3rem] text-[1.3rem] font-[700] text-[#111827]">
            User Management
          </h2>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            Manage users and admin access
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap ms-auto">
          <span>
            <SheetWrapper
              open={isUserSheetOpen}
              title={isEditMode ? "Edit User" : "Add New User"}
              description={
                isEditMode
                  ? "Edit the details of the user. The system will send them a message to complete setting up."
                  : "Enter details of new user. The system will send them a message to complete setting up."
              }
              setOpen={setIsUserSheetOpen}
              trigger={
                <CustomButton
                  onClick={handleAddNew}
                  title="Add New User"
                  showIcon
                  textClassName="md:text-[13px] text-[12px] font-[600] text-white"
                  className=" min-w-[120px] flex-1 rounded-[12px] border  md:h-[43px] h-[41px]"
                />
              }
            >
              <UserSheet
                user={isEditMode ? selectedUser : null}
                onClose={() => setIsUserSheetOpen(false)}
              />
            </SheetWrapper>
          </span>
        </div>
      </div>
      <CustomTable
        columns={usersTableColumns}
        rows={rows}
        loading={isLoading}
      />
    </div>
  );
};

export default ManageUsersTable;
