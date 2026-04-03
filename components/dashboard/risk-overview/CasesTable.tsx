"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomTable, { TableRowData } from "@/components/ui/custom-table";
import { TableSkeleton } from "@/skeleton/Overview";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CasesTableProps {
  columns: any[];
  rows: TableRowData[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  showPageInfo?: boolean;
  variant?: "cases" | "overview";
}

export const CasesTable: React.FC<CasesTableProps> = ({
  columns,
  rows,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  emptyMessage = "No cases available",
  showPageInfo = true,
  variant = "cases",
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (variant === "cases") {
    return (
      <div className="bg-none rounded-[20px] p-0">
        <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 mb-4">
          {totalPages > 0 && (
            <div className="ms-auto flex items-center gap-3">
              {showPageInfo && (
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              )}
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

        <CustomTable
          columns={columns}
          rows={rows}
          emptyMessage={emptyMessage}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        {showPageInfo && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <ChevronLeft
                className={`cursor-pointer ${
                  currentPage === 1 && "opacity-40"
                }`}
                onClick={handlePrevPage}
              />
              <ChevronRight
                className={`cursor-pointer ${
                  currentPage === totalPages && "opacity-40"
                }`}
                onClick={handleNextPage}
              />
            </div>
          </div>
        )}
      </div>

      <CustomTable columns={columns} rows={rows} emptyMessage={emptyMessage} />
    </div>
  );
};

export default CasesTable;
