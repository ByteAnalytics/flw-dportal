"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { useGet } from "@/hooks/use-queries";
import { TableSkeleton } from "@/skeleton/overview";
import { CasesResponse } from "@/types/risk-overview";
import { RECENT_RISK_CASES_COLUMN } from "@/constants/risk-overview";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import { ChevronDown } from "lucide-react";
import NewCaseSheet from "../risk-overview/NewCaseSheet";
import { FACILITY_TYPES, STATUS_OPTIONS } from "@/constants/risk-cases";

const RiskCases = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFacility, setSelectedFacility] =
    useState("All Facility Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const { data: casesData, isLoading: casesLoading } = useGet<CasesResponse>(
    ["risk-cases", currentPage.toString(), selectedFacility, selectedStatus],
    `/cases?page=${currentPage}&page_size=10${
      selectedFacility !== "All Facility Types"
        ? `&facility_type=${selectedFacility}`
        : ""
    }${selectedStatus !== "All Status" ? `&status=${selectedStatus}` : ""}`,
  );

  const tableRows = useMemo(() => {
    if (!casesData?.data) return [];

    const filtered = casesData.data.filter((c) =>
      search
        ? c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
          c.case_id?.toLowerCase().includes(search.toLowerCase())
        : true,
    );

    return filtered.map((c) => ({
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
          {c.status?.toUpperCase() === "PENDING" ? "Review" : "Open"} →
        </span>
      ),
    }));
  }, [casesData, search]);

  const totalPages = Math.ceil((casesData?.total_count ?? 0) / 10);

  const facilityDropdownItems: DropdownItem[] = FACILITY_TYPES.map((f) => ({
    label: f,
    onClick: () => {
      setSelectedFacility(f);
      setCurrentPage(1);
    },
  }));

  const statusDropdownItems: DropdownItem[] = STATUS_OPTIONS.map((s) => ({
    label: s,
    onClick: () => {
      setSelectedStatus(s);
      setCurrentPage(1);
    },
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[1.4rem] font-bold text-gray-900">Risk Cases</h1>
        </div>

        <Button
          onClick={() => setIsSheetOpen(true)}
          className="w-[117px] h-[40px] flex items-center gap-2 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[16px] font-semibold"
        >
          New Case
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap  items-center gap-3 mb-6 bg-[#F7F7F7] p-[0.5rem]">
        {/* Search */}
        <div className=" flex items-center gap-2 h-[40px] flex-1 border border-InfraBorder bg-background rounded-[8px] px-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
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
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1 h-10 border border-InfraBorder bg-[#F3F3F3] rounded-[10px] px-3 text-sm text-gray-600 hover:text-gray-700 font-medium">
                <ChevronLeft
                  className={`w-4 h-4 cursor-pointer ${
                    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
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

      {/* New Case Sheet */}
      <SheetWrapper
        title="Model Information"
        open={isSheetOpen}
        setOpen={setIsSheetOpen}
        width="sm:max-w-[500px]"
      >
        <NewCaseSheet
          onClose={() => setIsSheetOpen(false)}
          onSuccess={() => setIsSheetOpen(false)}
        />
      </SheetWrapper>
    </div>
  );
};

export default RiskCases;
