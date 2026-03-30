"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import { StatCard } from "@/components/shared/StatCard";
import { formatNumber, formatDate } from "@/lib/utils";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import { RECENT_RISK_CASES_COLUMN } from "@/constants/risk-overview";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import CaseSheetFlow from "./CaseSheetFlow";
import CaseDetailsSheet from "./CaseDetailsSheet";
import { ReturnedCaseSheet } from "./ReturnedCaseSheet";
import ValidationReviewSheet from "./ValidationReviewSheet";
import { useGet } from "@/hooks/use-queries";
import { ApiResponse, PaginatedResponse } from "@/types";
import { StatCardSkeleton, TableSkeleton } from "@/skeleton/Overview";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";
import { useRouter } from "nextjs-toploader/app";

interface CaseItem {
  id: string;
  case_number: string;
  customer_name: string;
  facility_type: string;
  project_type: string;
  status: string;
  rater_name: string;
  validator_name: string | null;
  rating: string | null;
  last_updated: string;
}

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

const CaseOverviewPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isSheetOpen,
    activeDetailsSheet,
    selectedCaseId,
    setIsSheetOpen,
    setActiveDetailsSheet,
    setSelectedCaseId,
  } = useRiskOverviewStore();

  const { data: casesRes, isLoading: casesLoading } = useGet<
    ApiResponse<PaginatedResponse<CaseItem>>
  >(
    ["cases", currentPage.toString()],
    `/crr/cases?page=${currentPage}&page_size=10`,
    { refetchOnMount: "always" },
  );

  const { data: dashboardRes, isLoading: dashboardLoading } = useGet<
    ApiResponse<DashboardResponse>
  >(["cases-dashboard"], `/crr/cases/dashboard`, {
    refetchOnMount: "always",
  });

  const casesData = casesRes?.data;
  const dashboardData = dashboardRes?.data;

  const isLoading = casesLoading || dashboardLoading;

  const goToPageIfDraft = (caseId: string, facilityType: string) => {
    setSelectedCaseId(caseId);
    setIsSheetOpen(true);
    router.push(
      `/dashboard/ccr/overview?step=pf_financials&caseId=${caseId}&facilityType=${encodeURIComponent(facilityType)}`,
    );
  };

  const tableRows = useMemo(() => {
    if (!casesData?.data) return [];

    return casesData.data.map((c) => {
      const status = c.status?.toUpperCase();

      return {
        caseId: (
          <span className="text-gray-500 font-medium">{c.case_number}</span>
        ),
        customerName: (
          <span className="text-[#003A1B] font-semibold">
            {c.customer_name}
          </span>
        ),
        facilityType: c.facility_type,
        rater: c.rater_name,
        validator: c.validator_name ?? "-",
        lastUpdated: formatDate(c.last_updated),
        status,
        rating: (
          <span className="font-semibold text-gray-700">{c.rating ?? "-"}</span>
        ),
        actions: (
          <span
            className="flex items-center gap-1 text-[13px] font-semibold text-emerald-600 cursor-pointer hover:text-emerald-700"
            onClick={() => {
              setSelectedCaseId(c.id);

              if (status?.toUpperCase() === "PENDING") {
                setActiveDetailsSheet("validation");
              } else if (status?.toUpperCase() === "RETURNED") {
                setActiveDetailsSheet("returned");
              } else if (status?.toUpperCase() === "DRAFT") {
                goToPageIfDraft(c.id, c.facility_type);
              } else {
                setActiveDetailsSheet("details");
              }
            }}
          >
            {status === "PENDING" ? "Review" : "Open"} →
          </span>
        ),
      };
    });
  }, [casesData, setSelectedCaseId, setActiveDetailsSheet]);

  const totalPages = casesData?.pages ?? 1;

  const stats = dashboardData?.stats;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-9 w-32 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <TableSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[1.4rem] font-bold text-gray-900">Overview</h1>

          <Button
            onClick={() => setIsSheetOpen(true)}
            className="w-[117px] h-[40px] bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white font-semibold"
          >
            New Case
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <StatCard
            title="Total Cases"
            icon={<CustomerSvg />}
            value={formatNumber(stats?.total_cases ?? 0)}
          />
          <StatCard
            title="Pending Review"
            icon={<EadSvg />}
            value={formatNumber(stats?.pending_review ?? 0)}
          />
          <StatCard
            title="Approved Cases"
            icon={<LGDSvg />}
            value={formatNumber(stats?.approved_cases ?? 0)}
          />
          <StatCard
            title="Rejected Cases"
            icon={<EclSvg />}
            value={formatNumber(stats?.rejected_cases ?? 0)}
          />
          <StatCard
            title="Avg Rating"
            icon={<NPLSvg />}
            value={stats?.avg_rating ?? "-"}
          />
        </div>

        {/* Table */}
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-gray-900">
              Recent Cases
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <ChevronLeft
                  className={`cursor-pointer ${
                    currentPage === 1 && "opacity-40"
                  }`}
                  onClick={() =>
                    currentPage > 1 && setCurrentPage((p) => p - 1)
                  }
                />
                <ChevronRight
                  className={`cursor-pointer ${
                    currentPage === totalPages && "opacity-40"
                  }`}
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage((p) => p + 1)
                  }
                />
              </div>
            </div>
          </div>

          <CustomTable
            columns={RECENT_RISK_CASES_COLUMN}
            rows={tableRows}
            emptyMessage="No cases available"
          />
        </div>

        {/* New Case Flow */}
        <CaseSheetFlow
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>

      {/* Details */}
      <SheetWrapper
        title="Case Details"
        open={activeDetailsSheet === "details"}
        setOpen={() => setActiveDetailsSheet(null)}
        width="sm:max-w-[80%]"
      >
        {selectedCaseId && (
          <CaseDetailsSheet
            caseId={selectedCaseId}
            onClose={() => setActiveDetailsSheet(null)}
          />
        )}
      </SheetWrapper>

      {/* Returned */}
      <SheetWrapper
        title="Returned Case"
        open={activeDetailsSheet === "returned"}
        setOpen={() => setActiveDetailsSheet(null)}
        width="sm:max-w-[80%]"
      >
        {selectedCaseId && (
          <ReturnedCaseSheet
            caseId={selectedCaseId}
            onClose={() => setActiveDetailsSheet(null)}
            onEditAndResubmit={() => {
              setActiveDetailsSheet(null);
              setIsSheetOpen(true);
            }}
          />
        )}
      </SheetWrapper>

      {/* Validation */}
      <SheetWrapper
        title="Validation Review"
        open={activeDetailsSheet === "validation"}
        setOpen={() => setActiveDetailsSheet(null)}
        width="sm:max-w-[80%]"
      >
        {selectedCaseId && (
          <ValidationReviewSheet
            caseId={selectedCaseId}
            onClose={() => setActiveDetailsSheet(null)}
            onReturnForRevision={() => {
              setActiveDetailsSheet(null);
              setIsSheetOpen(true);
            }}
            onApproveRating={() => setActiveDetailsSheet(null)}
          />
        )}
      </SheetWrapper>
    </>
  );
};

export default CaseOverviewPage;
