"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import CustomTable, { TableColumn } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { useGet } from "@/hooks/use-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiResponse } from "@/types";

interface TopObligor {
  "Counter Party": string;
  EAD: number;
  LGD: number;
  ECL: number;
  identifier: string;
}

interface TopObligorsApiResponse {
  top_obligors: TopObligor[];
}

interface Top20DebtorsTableProps {
  executionId?: string;
}

const PAGE_SIZE = 10;

export const Top20DebtorsTable: React.FC<Top20DebtorsTableProps> = ({
  executionId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMetric, setSelectedMetric] = useState<"ECL" | "EAD">("ECL");

  const buildUrl = () => {
    let url = `/guarantees/dashboard?section=top_obligors&identifier=${selectedMetric}`;
    if (executionId) url += `&execution_id=${executionId}`;
    return url;
  };

  const { data: obligorsData, isLoading } = useGet<
    ApiResponse<TopObligorsApiResponse>
  >(["top-obligors", selectedMetric, executionId ?? ""], buildUrl(), {
    staleTime: 0,
    refetchOnMount: "always",
  });

  const columns: TableColumn[] = [
    { key: "name", label: "CUSTOMER NAME", width: "md:w-[450px] w-[250px]" },
    { key: "ead", label: "EAD", align: "left" },
    { key: "lgd", label: "LGD", align: "left" },
    { key: "ecl", label: "ECL", align: "left" },
  ];

  const allRows = useMemo(() => {
    return obligorsData?.data?.top_obligors ?? [];
  }, [obligorsData]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allRows.slice(start, start + PAGE_SIZE);
  }, [allRows, currentPage]);

  const tableRows = useMemo(() => {
    return paginatedRows.map((o) => ({
      name: (
        <span className="text-[#003A1B] font-medium">{o["Counter Party"]}</span>
      ),
      ead: o.EAD?.toFixed(2) ?? "0.00",
      lgd: o.LGD?.toFixed(2) ?? "0.00",
      ecl: o.ECL?.toFixed(2) ?? "0.00",
    }));
  }, [paginatedRows]);

  const totalPages = Math.ceil(allRows.length / PAGE_SIZE);

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
                onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
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

      {isLoading ? (
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
