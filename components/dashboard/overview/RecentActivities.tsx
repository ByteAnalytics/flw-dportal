"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomTable, { TableColumn } from "@/components/ui/custom-table";
import { useGet } from "@/hooks/use-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiResponse } from "@/types";
import { formatDate } from "@/lib/utils";

interface RecentActivity {
  Process: string;
  Status: number | string;
  Details: string | number;
  time: string;
}

interface RecentActivitiesApiResponse {
  recent_activities: RecentActivity[];
}

interface RecentActivitiesTableProps {
  executionId?: string;
}

const PAGE_SIZE = 10;

// Sample/default data for testing UI without API
const SAMPLE_ACTIVITIES: RecentActivity[] = [
  {
    Process: "Generating POS Chargeback Evidence on CP",
    Status: 1,
    Details: "Processed 142 POS transactions",
    time: "2026-03-26 09:15:00",
  },
  {
    Process: "ECL Model Execution - Retail Portfolio",
    Status: 2,
    Details: "Processing 5,234 loans (72% complete)",
    time: "2026-03-26 10:30:00",
  },
  {
    Process: "IFRS 9 Staging Calculation",
    Status: 1,
    Details: "Stage allocation completed for 12,456 facilities",
    time: "2026-03-26 08:45:00",
  },
  {
    Process: "PD/LGD Model Calibration",
    Status: 3,
    Details: "Failed at 45% - Data quality issues detected",
    time: "2026-03-25 16:20:00",
  },
  {
    Process: "Macroeconomic Scenario Upload",
    Status: 1,
    Details: "3 scenarios uploaded (Baseline, Upside, Downside)",
    time: "2026-03-25 14:10:00",
  },
  {
    Process: "Credit Risk Dashboard Generation",
    Status: 2,
    Details: "Generating reports for Q1 2026",
    time: "2026-03-25 11:00:00",
  }
];

export const RecentActivitiesTable: React.FC<RecentActivitiesTableProps> = ({
  executionId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [useSampleData, setUseSampleData] = useState(true); // Toggle for sample data

  const buildUrl = () => {
    let url = `/guarantees/dashboard?section=recent_activities&filter=${selectedFilter}`;
    if (executionId) url += `&execution_id=${executionId}`;
    return url;
  };

  // Only fetch from API if useSampleData is false
  const { data: activitiesData, isLoading: isApiLoading } = useGet<
    ApiResponse<RecentActivitiesApiResponse>
  >(
    useSampleData
      ? ["recent-activities-sample"]
      : ["recent-activities", selectedFilter, executionId ?? ""],
    buildUrl(),
    {
      staleTime: 0,
      refetchOnMount: "always",
      enabled: !useSampleData, // Disable API call when using sample data
    },
  );

  const getFilteredActivities = (activities: RecentActivity[]) => {
    if (selectedFilter === "all") return activities;
    if (selectedFilter === "completed") {
      return activities.filter((a) => a.Status === 1);
    }
    if (selectedFilter === "pending") {
      return activities.filter((a) => a.Status === 2 || a.Status === 3);
    }
    return activities;
  };

  const allRows = useMemo(() => {
    if (useSampleData) {
      return getFilteredActivities(SAMPLE_ACTIVITIES);
    }
    return getFilteredActivities(activitiesData?.data?.recent_activities ?? []);
  }, [useSampleData, activitiesData, selectedFilter]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allRows.slice(start, start + PAGE_SIZE);
  }, [allRows, currentPage]);

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
    return paginatedRows.map((activity, idx) => ({
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
  }, [paginatedRows]);

  const totalPages = Math.ceil(allRows.length / PAGE_SIZE);
  const isLoading = useSampleData ? false : isApiLoading;

  return (
    <div className="bg-none rounded-[20px] p-0">
      <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-[15px] font-semibold text-gray-900">
            Recent Activities
          </h3>
        </div>

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
