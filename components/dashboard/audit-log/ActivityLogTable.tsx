"use client";

import { useState } from "react";
import CustomTable from "@/components/ui/custom-table";
import CustomButton from "@/components/ui/custom-button";
import { cn, formatDate } from "@/lib/utils";
import { BadgeIcon } from "@/svg";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { useGetPaginated } from "@/hooks/use-queries";
import { Activity } from "@/types/team-management";
import { ActivitiesTableColumn } from "@/constants/team-management";

const ActivityLogTable = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading } = useGetPaginated<Activity>(
    ["activityLogs"],
    "/users/activity-logs",
    { page: pageNumber, limit: 20 },
  );

  const activities = data?.data?.data || [];
  const pages = data?.data?.pages ?? 1;
  const totalCount = data?.data?.total ?? 0;

  const getStatusBadge = (status: string) => {
    const isActive = status?.toLowerCase() === "active";
    const isPending = status?.toLowerCase() === "pending";

    const getStyle = (): string => {
      if (isActive) {
        return "bg-[#D1FAE5] text-[#39D98A]";
      } else if (isPending) {
        return "bg-[#FFFBDE] text-[#E5B800]";
      } else {
        return "bg-[#FEE2E2] text-[#FF5C5C]";
      }
    };

    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-[12px] capitalize font-[500] flex items-center justify-center gap-2 w-fit",
          getStyle(),
        )}
      >
        <BadgeIcon fill={isActive ? "#39D98A" : "#FF5C5C"} />
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const isSuperUser = role?.toLowerCase() === "super_user";
    const isAdmin = role?.toLowerCase() === "admin";
    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-[12px] font-[500] flex items-center justify-center gap-2 w-fit",
          isSuperUser
            ? "bg-[#E0ECFF] text-[#0063F7]"
            : isAdmin
              ? "bg-[#FFFBDE] text-[#E5B800]"
              : "bg-[#F2F4F5] text-[#536066]",
        )}
      >
        <BadgeIcon
          fill={isSuperUser ? "#0063F7" : isAdmin ? "#E5B800 " : "#536066"}
        />
        {role}
      </span>
    );
  };

  const rows =
    activities.map((activity) => ({
      name: activity.name,
      timestamp: formatDate(activity.timestamp),
      email: activity.email,
      role: getRoleBadge(activity.role),
      status: getStatusBadge(activity.status),
      actions: activity.action,
    })) || [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[1.4rem] font-[700] text-[#111827]">
            Audit Log
          </h2>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View all user actions
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap ms-auto justify-end">
          <ExportTrigger
            exportApiUrl="/reporting/exports/activity?page_size=1000"
            emailExportApiUrl="/reporting/email/activity?page_size=1000"
            exportFileName="ActivityLog"
            trigger={
              <CustomButton
                title="Export Log"
                showIcon
                textClassName="md:text-[13px] text-[12px] font-[600] text-white"
                className=" min-w-[98px] flex-1 rounded-[12px] border  h-[37px]"
              />
            }
          />
        </div>
      </div>

      <CustomTable
        loading={isLoading}
        columns={ActivitiesTableColumn}
        rows={rows}
      />

      <Pagination
        totalCount={totalCount}
        totalPageNumber={pages}
        activePage={String(pageNumber)}
        setPageNumber={setPageNumber}
      />
    </div>
  );
};

export default ActivityLogTable;
