"use client";

import { useState } from "react";
import CustomTable from "@/components/ui/custom-table";
import CustomButton from "@/components/ui/custom-button";
import { formatDate } from "@/lib/utils";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { useGetPaginated } from "@/hooks/use-queries";
import { Activity } from "@/types/team-management";
import {
  ActivitiesTableColumn,
  itemsPerPage,
} from "@/constants/team-management";
import { getRoleBadge, getStatusBadge } from "@/components/shared/Badge";

const ActivityLogTable = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading } = useGetPaginated<Activity>(
    ["users", "activity-logs"],
    "/users/activity-logs",
    { page: pageNumber, limit: 20 },
  );

  const activities = data?.data?.data || [];
  const pages = data?.data?.pages ?? 1;
  const currentPage = data?.data?.page;

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
          <h2 className="text-[1.4rem] font-[700] text-[#111827]">Audit Log</h2>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View all user actions
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap ms-auto justify-end">
          <ExportTrigger
            exportApiUrl="/users/activity-logs/export"
            emailExportApiUrl="/users/activity-logs/export?page_size=1000"
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
        itemsPerPage={itemsPerPage}
        totalPageNumber={pages}
        activePage={String(currentPage)}
        setPageNumber={setPageNumber}
      />
    </div>
  );
};

export default ActivityLogTable;
