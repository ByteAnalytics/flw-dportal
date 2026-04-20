"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomTable, { TableColumn } from "@/components/ui/custom-table";
import { useGet } from "@/hooks/use-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiResponse, PaginatedResponse } from "@/types";
import { formatDate } from "@/lib/utils";

export interface RecentActivity {
  Process: string;
  Status: number | string;
  Details: string | number;
  time: string;
}

const PAGE_SIZE = 10;

export const RecentActivitiesTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const buildUrl = () => {
    return `/me/activities?page=${currentPage}&page_size=${PAGE_SIZE}`;
  };

  const { data: activitiesData, isLoading } = useGet<
    ApiResponse<PaginatedResponse<RecentActivity>>
  >(["recent-activities", currentPage.toString()], buildUrl(), {
    staleTime: 0,
    refetchOnMount: "always",
  });

  const getStatusBadge = (status: number | string) => {
    const statusNum = typeof status === "string" ? parseInt(status) : status;

    switch (statusNum) {
      case 1:
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            ✓ Completed
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            ⟳ In Progress
          </span>
        );
      case 3:
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            ✗ Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            ○ Pending
          </span>
        );
    }
  };

  const columns: TableColumn[] = [
    { key: "process", label: "PROCESS", width: "md:w-[350px] w-[200px]" },
    { key: "status", label: "STATUS", width: "md:w-[150px] w-[120px]" },
    { key: "details", label: "DETAILS", width: "md:w-[300px] w-[180px]" },
    { key: "time", label: "TIME", width: "md:w-[200px] w-[150px]" },
  ];

  const tableRows = useMemo(() => {
    const activities = activitiesData?.data?.data ?? [];
    return activities.map((activity, idx) => ({
      key: idx,
      process: (
        <span className="text-[#003A1B] font-medium">{activity.Process}</span>
      ),
      status: getStatusBadge(activity.Status),
      details: <span className="text-gray-600">{activity.Details}</span>,
      time: (
        <span className="text-gray-500 text-sm">
          {formatDate(activity.time)}
        </span>
      ),
    }));
  }, [activitiesData]);

  const totalItems = activitiesData?.data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <div className="bg-none rounded-[20px] p-0">
      <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Recent Activities
        </h3>

        {totalPages > 0 && (
          <div className="ms-auto flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1 h-10 border border-InfraBorder bg-[#F3F3F3] rounded-[10px] px-3 text-sm text-gray-600 hover:text-gray-700 font-medium">
              <ChevronLeft
                className={`w-4 h-4 cursor-pointer ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
                }`}
                onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
              />
              <span
                className="cursor-pointer"
                onClick={() =>
                  currentPage < totalPages && setCurrentPage((p) => p + 1)
                }
              >
                Next
              </span>
              <ChevronRight
                className={`w-4 h-4 cursor-pointer ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                onClick={() =>
                  currentPage < totalPages && setCurrentPage((p) => p + 1)
                }
              />
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner loadingText="Loading activities..." />
        </div>
      ) : (
        <CustomTable
          columns={columns}
          rows={tableRows}
          emptyMessage="No recent activities found"
        />
      )}
    </div>
  );
};
