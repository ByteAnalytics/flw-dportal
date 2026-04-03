"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { useGet } from "@/hooks/use-queries";
import { TableSkeleton } from "@/skeleton/Overview";
import {
  facilityTypeOptions,
  RECENT_RISK_CASES_COLUMN,
} from "@/constants/risk-overview";
import { STATUS_OPTIONS } from "@/constants/risk-cases";
import { useRouter } from "nextjs-toploader/app";
import { ApiPaginatedResponse } from "@/types";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";
import { CaseItem } from "@/types/risk-overview";
import CaseSheetFlow from "../risk-overview/CaseSheetFlow";
import { CaseSheets } from "../risk-overview/CaseSheets";
import { buildTableRows } from "@/lib/build-table-rows";

const STATUS_API_MAP: Record<string, string> = {
  "Pending Review": "Pending_Review",
  Validated: "Validated",
  Rejected: "Rejected",
  Draft: "Draft",
};

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

  const queryParams = buildQueryParams({
    currentPage,
    selectedFacility,
    selectedStatus,
    search,
  });

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
    `/crr/cases?${queryParams}`,
    { refetchOnMount: "always" },
  );

  const casesData = casesResponse?.data;
  const totalPages = casesData?.pages ?? 1;
  const currentPageNum = casesData?.page ?? currentPage;

  const resetPage = () => setCurrentPage(1);

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
  });

  const facilityDropdownItems: DropdownItem[] = [
    {
      label: "All Facility Types",
      onClick: () => {
        setSelectedFacility("All Facility Types");
        resetPage();
      },
    },
    ...facilityTypeOptions.map((f) => ({
      label: f.label,
      onClick: () => {
        setSelectedFacility(f.value);
        resetPage();
      },
    })),
  ];

  const statusDropdownItems: DropdownItem[] = [
    {
      label: "All Status",
      onClick: () => {
        setSelectedStatus("All Status");
        resetPage();
      },
    },
    ...STATUS_OPTIONS.map((s) => ({
      label: s,
      onClick: () => {
        setSelectedStatus(s);
        resetPage();
      },
    })),
  ];

  return (
    <>
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[1.4rem] font-bold text-gray-900">Risk Cases</h1>
          <Button
            onClick={() => setIsSheetOpen(true)}
            className="w-[117px] h-[40px] flex items-center gap-2 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[16px] font-semibold"
          >
            New Case
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#F7F7F7] p-2">
          <div className="flex items-center gap-2 h-[40px] flex-1 border border-InfraBorder bg-background rounded-[8px] px-3">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Search by customer name or case ID"
              className="w-full font-semibold bg-background text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>

          <FilterDropdown
            label={selectedFacility}
            items={facilityDropdownItems}
          />
          <FilterDropdown label={selectedStatus} items={statusDropdownItems} />
        </div>

        <div>
          {totalPages > 0 && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Page {currentPageNum} of {totalPages}
                </span>
                <div className="flex items-center gap-1 h-10 border border-InfraBorder bg-[#F3F3F3] rounded-[10px] px-3 text-sm text-gray-600 font-medium">
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
            </div>
          )}

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

        <CaseSheetFlow
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>

      <CaseSheets
        activeDetailsSheet={activeDetailsSheet}
        selectedCaseId={selectedCaseId}
        setActiveDetailsSheet={setActiveDetailsSheet}
        setIsSheetOpen={setIsSheetOpen}
      />
    </>
  );
};

const FilterDropdown = ({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) => (
  <CustomDropdown
    trigger={
      <Button
        variant="outline"
        className="ms-auto h-[40px] flex items-center gap-2 text-gray-500 font-semibold text-[13px] max-w-[333px] w-full justify-between border-InfraBorder"
      >
        {label}
        <ChevronDown className="w-4 h-4" />
      </Button>
    }
    items={items}
  />
);

function buildQueryParams({
  currentPage,
  selectedFacility,
  selectedStatus,
  search,
}: {
  currentPage: number;
  selectedFacility: string;
  selectedStatus: string;
  search: string;
}): string {
  const params = new URLSearchParams({
    page: String(currentPage),
    page_size: "10",
  });
  if (selectedFacility !== "All Facility Types")
    params.append("facility_type", selectedFacility);
  if (selectedStatus !== "All Status")
    params.append("status", STATUS_API_MAP[selectedStatus] ?? selectedStatus);
  if (search) params.append("search", search);
  return params.toString();
}

export default RiskCases;
