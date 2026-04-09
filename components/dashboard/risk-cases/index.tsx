"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { useGet } from "@/hooks/use-queries";
import { facilityTypeOptions } from "@/constants/risk-overview";
import { STATUS_OPTIONS } from "@/constants/risk-cases";
import { ApiPaginatedResponse } from "@/types";
import { CaseItem } from "@/types/risk-overview";
import CaseSheetFlow from "../risk-overview/CaseSheetFlow";
import { CaseSheets } from "../risk-overview/CaseSheets";
import { TableSkeleton } from "@/skeleton";
import { useCaseTable } from "@/hooks/use-case-table";
import { buildCaseTableColumns } from "@/lib/case-table-columns";
import { CaseDeleteBanner } from "../risk-overview/CaseDeleteBanner";

const STATUS_API_MAP: Record<string, string> = {
  "Pending Review": "Pending_Review",
  Validated: "Validated",
  Rejected: "Rejected",
  Draft: "Draft",
};

const RiskCases = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedFacility, setSelectedFacility] =
    useState("All Facility Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const queryParams = buildQueryParams({
    currentPage,
    selectedFacility,
    selectedStatus,
    search,
  });

  const {
    data: casesResponse,
    isLoading: casesLoading,
    refetch,
  } = useGet<ApiPaginatedResponse<CaseItem>>(
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
    onDeleteSuccess: () => refetch(),
  });

  const resetPage = () => {
    setCurrentPage(1);
    clearSelection();
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    clearSelection();
  };

  const columns = buildCaseTableColumns(selectAll, handleSelectAll);

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
          {!isValidValidator && (
            <Button
              onClick={() => setIsSheetOpen(true)}
              className="w-[117px] h-[40px] flex items-center gap-2 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[16px] font-semibold"
            >
              New Case
            </Button>
          )}
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
            <div className="flex justify-between items-center mb-4">
              {hasSelectedRows && (
                <CaseDeleteBanner
                  count={selectedRows.size === tableRows?.length ? "all" : selectedRows?.size?.toString()}
                  isDeleting={isDeleting}
                  onDelete={handleDeleteSelected}
                  compact
                />
              )}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-600">
                  Page {currentPageNum} of {totalPages}
                </span>
                <div className="flex items-center gap-1 h-10 border border-InfraBorder bg-[#F3F3F3] rounded-[10px] px-3 text-sm text-gray-600 font-medium">
                  <ChevronLeft
                    className={`w-4 h-4 cursor-pointer ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                  />
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                  >
                    Next
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 cursor-pointer ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
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
              columns={columns}
              rows={tableRows}
              emptyMessage="No cases available"
              hasCheckbox
              isActionOnRow
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
        selectedCaseDetails={
          casesData?.data?.find((c) => c.id === selectedCaseId) as CaseItem
        }
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
