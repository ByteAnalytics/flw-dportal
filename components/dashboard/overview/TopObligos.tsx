"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import CustomTable, { TableColumn } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { useGet } from "@/hooks/use-queries";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface TopDebtor {
  "CLIENT NAME": string;
  EAD: number;
  LGD: number;
  ECL: number;
  identifier: string;
}

interface TopObligorsResponse {
  total_count: number;
  page: number;
  page_size: number;
  data: TopDebtor[];
}

interface Top20DebtorsTableProps {
  filteredObligors?: TopDebtor[];
}

export const Top20DebtorsTable: React.FC<Top20DebtorsTableProps> = ({
  filteredObligors,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMetric, setSelectedMetric] = useState<"ECL" | "EAD">("ECL");

  const { data: obligorsData, isLoading } = useGet<TopObligorsResponse>(
    ["top-obligors", selectedMetric, currentPage.toString()],
    `/reporting/models/dashboard?section=top_obligors&metric=${selectedMetric}&page=${currentPage}&page_size=10`,
    {
      enabled: !filteredObligors,
    },
  );

  const columns: TableColumn[] = [
    { key: "name", label: "CUSTOMER NAME", width: "md:w-[450px] w-[250px]" },
    { key: "ead", label: "EAD", align: "left" },
    { key: "lgd", label: "LGD", align: "left" },
    { key: "ecl", label: "ECL", align: "left" },
    { key: "pd", label: "PD", align: "left" },
  ];

  const tableRows = useMemo(() => {
    if (filteredObligors && filteredObligors.length > 0) {
      const startIndex = (currentPage - 1) * 10;
      const paginatedData = filteredObligors.slice(startIndex, startIndex + 10);

      return paginatedData.map((obligor) => ({
        name: (
          <span className="text-[#003A1B] font-medium">
            {obligor["CLIENT NAME"]}
          </span>
        ),
        ead: formatCurrency(obligor.EAD),
        lgd: formatPercentage(obligor.LGD),
        ecl: formatCurrency(obligor.ECL),
      }));
    }

    if (!obligorsData?.data) return [];

    return obligorsData.data.map((obligor) => ({
      name: (
        <span className="text-[#003A1B] font-medium">
          {obligor["CLIENT NAME"]}
        </span>
      ),
      ead: formatCurrency(obligor.EAD),
      lgd: formatPercentage(obligor.LGD),
      ecl: formatCurrency(obligor.ECL),
    }));
  }, [obligorsData, filteredObligors, selectedMetric, currentPage]);

  const filterItems: DropdownItem[] = [
    {
      label: "By ECL",
      onClick: () => {
        setSelectedMetric("ECL");
        setCurrentPage(1);
      },
    },
    {
      label: "By EAD",
      onClick: () => {
        setSelectedMetric("EAD");
        setCurrentPage(1);
      },
    },
  ];

  const totalPages = filteredObligors
    ? Math.ceil(filteredObligors.length / 10)
    : Math.ceil((obligorsData?.total_count || 0) / 10);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-none rounded-[20px] p-0">
      <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-[15px] font-semibold text-gray-900">
            Top 20 Obligos
          </h3>

          <CustomDropdown
            trigger={
              <Button
                variant="outline"
                className="flex items-center gap-1 text-[12px] sm:px-3 sm:py-2 font-medium text-gray-600"
              >
                By {selectedMetric}
                <ChevronDown className="w-4 h-4" />
              </Button>
            }
            items={filterItems}
          />
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
                onClick={handlePrevPage}
              />
              <span className="cursor-pointer" onClick={handleNextPage}>
                Next
              </span>
              <ChevronRight
                className={`w-4 h-4 cursor-pointer ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleNextPage}
              />
            </div>
          </div>
        )}
      </div>

      {isLoading && !filteredObligors ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner loadingText="Loading obligors..." />
        </div>
      ) : (
        <CustomTable
          columns={columns}
          rows={tableRows}
          emptyMessage="No obligors data available"
        />
      )}
    </div>
  );
};
