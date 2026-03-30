"use client";

import CaseSheetFlow from "../risk-overview/CaseSheetFlow";
import CaseDetailsSheet from "../risk-overview/CaseDetailsSheet";
import { ReturnedCaseSheet } from "../risk-overview/ReturnedCaseSheet";
import ValidationReviewSheet from "../risk-overview/ValidationReviewSheet";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { useGet } from "@/hooks/use-queries";
import { TableSkeleton } from "@/skeleton/Overview";
import {
  facilityTypeOptions,
  RECENT_RISK_CASES_COLUMN,
} from "@/constants/risk-overview";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import { ChevronDown } from "lucide-react";
import { STATUS_OPTIONS } from "@/constants/risk-cases";
import { useRouter } from "nextjs-toploader/app";
import { ApiPaginatedResponse } from "@/types";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";

interface CaseItem {
  case_id: string;
  case_number: string;
  customer_name: string;
  facility_type: string;
  project_type: string;
  status: string;
  rater: string;
  validator: string | null;
  rating: string | null;
  last_updated: string;
}

const RiskCases = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedFacility, setSelectedFacility] =
    useState("All Facility Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const {
    isSheetOpen,
    activeDetailsSheet,
    selectedCaseId,
    setIsSheetOpen,
    setActiveDetailsSheet,
    setSelectedCaseId,
  } = useRiskOverviewStore();

  const queryParams = new URLSearchParams();
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", "10");

  if (selectedFacility !== "All Facility Types") {
    queryParams.append("facility_type", selectedFacility);
  }

  if (selectedStatus !== "All Status") {
    let apiStatus = selectedStatus;
    if (selectedStatus === "Pending Review") apiStatus = "Pending_Review";
    if (selectedStatus === "Validated") apiStatus = "Validated";
    if (selectedStatus === "Rejected") apiStatus = "Rejected";
    if (selectedStatus === "Draft") apiStatus = "Draft";
    queryParams.append("status", apiStatus);
  }

  if (search) {
    queryParams.append("search", search);
  }

  const { data: casesResponse, isLoading: casesLoading } = useGet<
    ApiPaginatedResponse<CaseItem>
  >(
    [
      "risk-cases",
      currentPage.toString(),
      selectedFacility,
      selectedStatus,
      search,
    ],
    `/crr/cases?${queryParams.toString()}`,
    { refetchOnMount: "always" },
  );

  const casesData = casesResponse?.data;
  const paginatedData = casesData?.data;

  const goToPageIfDraft = (caseId: string, facilityType: string) => {
    setSelectedCaseId(caseId);
    setIsSheetOpen(true);
    router.push(
      `/dashboard/ccr/overview?step=pf_financials&caseId=${caseId}&facilityType=${encodeURIComponent(facilityType)}`,
    );
  };

  const tableRows = useMemo(() => {
    if (!paginatedData) return [];

    return paginatedData.map((c) => {
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
        rater: c.rater,
        validator: c.validator || "-",
        lastUpdated: c.last_updated,
        status,
        rating: (
          <span className="font-semibold text-gray-700">{c.rating || "-"}</span>
        ),
        actions: (
          <span
            className="flex items-center gap-1 text-[13px] font-semibold text-emerald-600 cursor-pointer hover:text-emerald-700"
            onClick={() => {
              setSelectedCaseId(c.case_id);

              if (status === "PENDING_REVIEW") {
                setActiveDetailsSheet("validation");
              } else if (status === "REJECTED" || status === "VALIDATED") {
                setActiveDetailsSheet("details");
              } else if (status === "DRAFT") {
                goToPageIfDraft(c.case_id, c.facility_type);
              } else {
                setActiveDetailsSheet("details");
              }
            }}
          >
            {status === "PENDING_REVIEW" ? "Review" : "Open"} →
          </span>
        ),
      };
    });
  }, [paginatedData, setSelectedCaseId, setActiveDetailsSheet]);

  const totalPages = casesData?.pages ?? 1;
  const currentPageNum = casesData?.page ?? currentPage;

  const facilityDropdownItems: DropdownItem[] = [
    {
      label: "All Facility Types",
      onClick: () => {
        setSelectedFacility("All Facility Types");
        setCurrentPage(1);
      },
    },
    ...facilityTypeOptions.map((f) => ({
      label: f.label,
      onClick: () => {
        setSelectedFacility(f.value);
        setCurrentPage(1);
      },
    })),
  ];

  const statusDropdownItems: DropdownItem[] = [
    {
      label: "All Status",
      onClick: () => {
        setSelectedStatus("All Status");
        setCurrentPage(1);
      },
    },
    ...STATUS_OPTIONS.map((s) => ({
      label: s,
      onClick: () => {
        setSelectedStatus(s);
        setCurrentPage(1);
      },
    })),
  ];

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-[1.4rem] font-bold text-gray-900">
              Risk Cases
            </h1>
          </div>

          <Button
            onClick={() => setIsSheetOpen(true)}
            className="w-[117px] h-[40px] flex items-center gap-2 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[16px] font-semibold"
          >
            New Case
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#F7F7F7] p-[0.5rem]">
          {/* Search */}
          <div className="flex items-center gap-2 h-[40px] flex-1 border border-InfraBorder bg-background rounded-[8px] px-3">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by customer name or case ID"
              className="w-full font-[600] bg-background text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Facility Type Filter */}
          <CustomDropdown
            trigger={
              <Button
                variant="outline"
                className="ms-auto h-[40px] flex items-center gap-2 text-gray-500 font-[600] text-[13px] max-w-[333px] w-full justify-between border-InfraBorder"
              >
                {selectedFacility}
                <ChevronDown className="w-4 h-4" />
              </Button>
            }
            items={facilityDropdownItems}
          />

          {/* Status Filter */}
          <CustomDropdown
            trigger={
              <Button
                variant="outline"
                className="ms-auto h-[40px] flex items-center gap-2 text-gray-500 font-[600] text-[13px] max-w-[333px] w-full justify-between border-InfraBorder"
              >
                {selectedStatus}
                <ChevronDown className="w-4 h-4" />
              </Button>
            }
            items={statusDropdownItems}
          />
        </div>

        {/* Table */}
        <div className="bg-none rounded-[20px] p-0">
          <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 mb-4">
            {totalPages > 0 && (
              <div className="ms-auto flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Page {currentPageNum} of {totalPages}
                </span>
                <div className="flex items-center gap-1 h-10 border border-InfraBorder bg-[#F3F3F3] rounded-[10px] px-3 text-sm text-gray-600 hover:text-gray-700 font-medium">
                  <ChevronLeft
                    className={`w-4 h-4 cursor-pointer ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
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
      </div>

      {/* Main Case Flow Sheet - This handles the entire multi-step form */}
      <CaseSheetFlow open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />

      {/* Details Sheet */}
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

      {/* Returned Sheet */}
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

      {/* Validation Sheet */}
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

export default RiskCases;
