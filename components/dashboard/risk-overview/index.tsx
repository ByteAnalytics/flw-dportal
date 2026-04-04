"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import { StatCard } from "@/components/shared/StatCard";
import { formatNumber } from "@/lib/utils";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import { RECENT_RISK_CASES_COLUMN } from "@/constants/risk-overview";
import CaseSheetFlow from "./CaseSheetFlow";
import { CaseSheets } from "./CaseSheets";
import { useGet, useDynamicDelete } from "@/hooks/use-queries";
import { ApiResponse, PaginatedResponse } from "@/types";
import { StatCardSkeleton, TableSkeleton } from "@/skeleton";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";
import { useRouter } from "nextjs-toploader/app";
import { CaseItem } from "@/types/risk-overview";
import { buildTableRows } from "@/lib/build-table-rows";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const {
    isSheetOpen,
    activeDetailsSheet,
    selectedCaseId,
    setIsSheetOpen,
    setActiveDetailsSheet,
    setSelectedCaseId,
  } = useRiskOverviewStore();

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

  const deleteCase = useDynamicDelete<any>();

  const casesData = casesRes?.data;
  const stats = dashboardRes?.data?.stats;
  const totalPages = casesData?.pages ?? 1;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allIds = casesData?.data?.map((c) => c.id) ?? [];
      setSelectedRows(new Set(allIds));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (caseId: string) => {
    const updated = new Set(selectedRows);
    if (updated.has(caseId)) updated.delete(caseId);
    else updated.add(caseId);
    setSelectedRows(updated);
    setSelectAll(updated.size === (casesData?.data?.length ?? 0));
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Array.from(selectedRows);

    if (selectedIds.length === 0) {
      toast.error("Please select at least one case to delete");
      return;
    }

    try {
      let url = "/crr/cases";

      if (
        !(selectAll && selectedIds.length === (casesData?.data?.length ?? 0))
      ) {
        const queryParams = selectedIds.map((id) => `id=${id}`).join("&");
        url = `/crr/cases${queryParams?`?${queryParams}`:""}`;
      }

      await deleteCase.mutateAsync(url);

      toast.success(
        selectAll && selectedIds.length === (casesData?.data?.length ?? 0)
          ? "Successfully deleted all cases"
          : `Successfully deleted ${selectedIds.length} case(s)`,
      );

      setSelectedRows(new Set());
      setSelectAll(false);
      refetch();
      refetchDashboard();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete cases. Please try again.",
      );
      console.error("Delete error:", error);
    }
  };

  const goToPageIfDraft = useCallback(
    (caseId: string, facilityType: string) => {
      setSelectedCaseId(caseId);
      setIsSheetOpen(true);
      router.push(
        `/dashboard/ccr/overview?step=pf_financials&caseId=${caseId}&facilityType=${encodeURIComponent(facilityType)}`,
      );
    },
    [setSelectedCaseId, setIsSheetOpen, router],
  );

  const tableRows = buildTableRows(casesData?.data, {
    setSelectedCaseId,
    setActiveDetailsSheet,
    goToPageIfDraft,
    selectedRows,
    handleRowSelect,
  });

  const hasSelectedRows = selectedRows.size > 0;

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
          <Button
            onClick={() => setIsSheetOpen(true)}
            className="w-[117px] h-[40px] bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white font-semibold"
          >
            New Case
          </Button>
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
              onPrev={() => setCurrentPage((p) => p - 1)}
              onNext={() => setCurrentPage((p) => p + 1)}
            />
          </div>

          {hasSelectedRows && (
            <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
              <div className="text-red-800">
                <span className="font-medium">{selectedRows.size}</span> case(s)
                selected
              </div>
              <Button
                onClick={handleDeleteSelected}
                disabled={deleteCase.isPending}
                className="!h-[43px] bg-red-600 hover:bg-red-700 text-white"
              >
                {deleteCase.isPending ? "Deleting..." : "Delete Selected"}
                <Trash2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          <CustomTable
            columns={RECENT_RISK_CASES_COLUMN}
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
        selectedCaseDetails={casesData?.data?.find((c) => c.id === selectedCaseId) as CaseItem}
        setIsSheetOpen={setIsSheetOpen}
      />
    </>
  );
};

const Paginator = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600">
      Page {currentPage} of {totalPages}
    </span>
    <div className="flex items-center gap-2">
      <ChevronLeft
        className={`cursor-pointer ${currentPage === 1 ? "opacity-40" : ""}`}
        onClick={() => currentPage > 1 && onPrev()}
      />
      <ChevronRight
        className={`cursor-pointer ${currentPage === totalPages ? "opacity-40" : ""}`}
        onClick={() => currentPage < totalPages && onNext()}
      />
    </div>
  </div>
);

export default CaseOverviewPage;
