"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import { StatCard } from "@/components/shared/StatCard";
import { formatNumber } from "@/lib/utils";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import CaseSheetFlow from "./CaseSheetFlow";
import { CaseSheets } from "./CaseSheets";
import { useGet } from "@/hooks/use-queries";
import { ApiResponse, PaginatedResponse } from "@/types";
import { StatCardSkeleton, TableSkeleton } from "@/skeleton";
import { CaseItem } from "@/types/risk-overview";
import { useCaseTable } from "@/hooks/use-case-table";
import { buildCaseTableColumns } from "@/lib/case-table-columns";
import Paginator from "./Paginator";
import { CaseDeleteBanner } from "./CaseDeleteBanner";

interface DashboardStats {
  total_cases: number;
  pending_review: number;
  approved_cases: number;
  rejected_cases: number;
  avg_rating: string | null;
}

interface DashboardResponse {
  stats: DashboardStats;
  recent_cases: CaseItem[];
}

const STAT_CARDS = (stats?: DashboardStats) => [
  {
    title: "Total Cases",
    icon: <CustomerSvg />,
    value: formatNumber(stats?.total_cases ?? 0),
  },
  {
    title: "Pending Review",
    icon: <EadSvg />,
    value: formatNumber(stats?.pending_review ?? 0),
  },
  {
    title: "Approved Cases",
    icon: <LGDSvg />,
    value: formatNumber(stats?.approved_cases ?? 0),
  },
  {
    title: "Rejected Cases",
    icon: <EclSvg />,
    value: formatNumber(stats?.rejected_cases ?? 0),
  },
  { title: "Avg Rating", icon: <NPLSvg />, value: stats?.avg_rating ?? "-" },
];

const CaseOverviewPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: casesRes,
    isLoading: casesLoading,
    refetch,
  } = useGet<ApiResponse<PaginatedResponse<CaseItem>>>(
    ["cases", currentPage.toString()],
    `/crr/cases?page=${currentPage}&page_size=10`,
    { refetchOnMount: "always" },
  );

  const {
    data: dashboardRes,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useGet<ApiResponse<DashboardResponse>>(
    ["cases-dashboard"],
    `/crr/cases/dashboard`,
    { refetchOnMount: "always" },
  );

  const casesData = casesRes?.data;
  const stats = dashboardRes?.data?.stats;
  const totalPages = casesData?.pages ?? 1;

  const {
    isSheetOpen,
    setIsSheetOpen,
    activeDetailsSheet,
    setActiveDetailsSheet,
    selectedCaseId,
    selectAll,
    hasSelectedRows,
    selectedRows,
    handleSelectAll,
    handleRowSelect,
    handleDeleteSelected,
    isDeleting,
    tableRows,
    isValidValidator,
    clearSelection,
  } = useCaseTable({
    casesData,
    onDeleteSuccess: () => {
      refetch();
      refetchDashboard();
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    clearSelection();
  };

  const columns = buildCaseTableColumns(selectAll, handleSelectAll);

  if (casesLoading || dashboardLoading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-9 w-32 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[1.4rem] font-bold text-gray-900">Overview</h1>
          {!isValidValidator && (
            <Button
              onClick={() => setIsSheetOpen(true)}
              className="w-[117px] h-[40px] bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white font-semibold"
            >
              New Case
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {STAT_CARDS(stats).map(({ title, icon, value }) => (
            <StatCard key={title} title={title} icon={icon} value={value} />
          ))}
        </div>

        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-gray-900">
              Recent Cases
            </h3>
            <Paginator
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => handlePageChange(currentPage - 1)}
              onNext={() => handlePageChange(currentPage + 1)}
            />
          </div>

          {hasSelectedRows && (
            <CaseDeleteBanner
              count={selectedRows?.size === tableRows?.length ? "all" : selectedRows?.size?.toString()}
              isDeleting={isDeleting}
              onDelete={handleDeleteSelected}
            />
          )}

          <CustomTable
            columns={columns}
            rows={tableRows}
            emptyMessage="No cases available"
            hasCheckbox
            isActionOnRow
          />
        </div>

        <CaseSheetFlow
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>

      <CaseSheets
        activeDetailsSheet={activeDetailsSheet}
        selectedCaseId={selectedCaseId}
        setActiveDetailsSheet={setActiveDetailsSheet}
        selectedCaseDetails={
          casesData?.data?.find((c) => c.id === selectedCaseId) as CaseItem
        }
        setIsSheetOpen={setIsSheetOpen}
      />
    </>
  );
};

export default CaseOverviewPage;
