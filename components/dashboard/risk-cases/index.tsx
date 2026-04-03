"use client";

import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { useGet, useDynamicDelete } from "@/hooks/use-queries";
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
import { TableSkeleton } from "@/skeleton";
import { toast } from "sonner";

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

  const deleteCase = useDynamicDelete<any>();

  const casesData = casesResponse?.data;
  const totalPages = casesData?.pages ?? 1;
  const currentPageNum = casesData?.page ?? currentPage;

  const resetPage = () => setCurrentPage(1);

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

  const hasSelectedRows = selectedRows.size > 0;

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
            <div className="flex justify-between items-center mb-4">
              {hasSelectedRows && (
                <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
                  <span className="text-red-800 font-medium">
                    {selectedRows.size} case(s) selected
                  </span>
                  <Button
                    onClick={handleDeleteSelected}
                    disabled={deleteCase.isPending}
                    className="h-[35px] bg-red-600 hover:bg-red-700 text-white text-sm"
                  >
                    {deleteCase.isPending ? "Deleting..." : "Delete Selected"}
                    <Trash2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto">
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
        selectedCaseDetails={casesData?.data?.find((c) => c.id === selectedCaseId) as CaseItem}
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
