"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import { StatCard } from "@/components/shared/StatCard";
import { useGet } from "@/hooks/use-queries";
import { formatNumber } from "@/lib/utils";
import { TableSkeleton } from "@/skeleton/overview";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import { CaseOverviewData, CasesResponse } from "@/types/risk-overview";
import { RECENT_RISK_CASES_COLUMN } from "@/constants/risk-overview";
import RiskOverviewSkeleton from "@/skeleton/risk-overview";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import NewCaseSheet from "./NewCaseSheet";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import CaseSheetFlow from "./CaseSheetFlow";

const CaseOverviewPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: overviewData, isLoading: overviewLoading } = useGet<{
    data: CaseOverviewData;
  }>(["case-overview"], `/cases/overview`);

  const { data: casesData, isLoading: casesLoading } = useGet<CasesResponse>(
    ["recent-cases", currentPage.toString()],
    `/cases/recent?page=${currentPage}&page_size=10`,
  );

  const tableRows = useMemo(() => {
    if (!casesData?.data) return [];
    return casesData.data.map((c) => ({
      caseId: <span className="text-gray-500 font-medium">{c.case_id}</span>,
      customerName: (
        <span className="text-[#003A1B] font-semibold">{c.customer_name}</span>
      ),
      facilityType: c.facility_type,
      rater: c.rater,
      validator: c.validator,
      lastUpdated: c.last_updated,
      status: c.status?.toUpperCase(),
      rating: <span className="font-semibold text-gray-700">{c.rating}</span>,
      actions: (
        <span className="flex items-center gap-1 text-[13px] font-semibold text-emerald-600 cursor-pointer hover:text-emerald-700">
          {c.status === "PENDING" ? "Review" : "Open"} →
        </span>
      ),
    }));
  }, [casesData]);

  const totalPages = Math.ceil((casesData?.total_count ?? 0) / 10);

  if (overviewLoading) return <RiskOverviewSkeleton />;

  const {
    total_cases,
    pending_review,
    approved_cases,
    rejected_cases,
    avg_rating,
  } = overviewData?.data ?? {
    total_cases: 0,
    pending_review: 0,
    approved_cases: 0,
    rejected_cases: 0,
    avg_rating: "-",
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[1.4rem] font-bold text-gray-900">Overview</h1>
        </div>

        <Button
          onClick={() => setIsSheetOpen(true)}
          className="w-[117px] h-[40px] flex items-center gap-2 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:bg-teal-700 text-white text-[16px] font-semibold"
        >
          New Case
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCard
          title="Total Cases"
          icon={<CustomerSvg />}
          value={formatNumber(total_cases)}
        />
        <StatCard
          title="Pending Review"
          icon={<EadSvg />}
          value={formatNumber(pending_review)}
        />
        <StatCard
          title="Approved Cases"
          icon={<LGDSvg />}
          value={formatNumber(approved_cases)}
        />
        <StatCard
          title="Rejected Cases"
          icon={<EclSvg />}
          value={formatNumber(rejected_cases)}
        />
        <StatCard title="Avg Rating" icon={<NPLSvg />} value={avg_rating} />
      </div>

      {/* Recent Cases Table */}
      <div className="bg-none rounded-[20px] p-0">
        <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-[15px] font-semibold text-gray-900">
            Recent Cases
          </h3>

          {totalPages > 0 && (
            <div className="ms-auto flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1 h-10 border border-InfraBorder bg-[#F3F3F3] rounded-[10px] px-3 text-sm text-gray-600 hover:text-gray-700 font-medium">
                <ChevronLeft
                  className={`w-4 h-4 cursor-pointer ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    currentPage > 1 && setCurrentPage((p) => p - 1)
                  }
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
                  className={`w-4 h-4 cursor-pointer ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage((p) => p + 1)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {casesLoading ? (
          <TableSkeleton />
        ) : (
          <CustomTable
            columns={RECENT_RISK_CASES_COLUMN}
            rows={tableRows}
            emptyMessage="No cases available"
          />
        )}
      </div>
      <CaseSheetFlow open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </div>
  );
};

export default CaseOverviewPage;
