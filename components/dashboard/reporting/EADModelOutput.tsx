"use client";

import React, { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { ChevronLeft } from "lucide-react";

import CustomTable from "@/components/ui/custom-table";
import { CustomTabs } from "@/components/shared/CustomTab";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {  useGet } from "@/hooks/use-queries";
import {
  formatColumnHeader,
  formatDate,
  getFileNameFromTab,
} from "@/lib/utils";
import {
  FileContentItem,
  PDModelOutputApiResponse,
  PDModelOutputApiResponseItem,
} from "@/types/reporting";
import {
  DEFAULT_COLUMNS,
  EXCLUDED_KEYS,
  formatPDValue,
  TAB_LABELS,
  TABS_WITH_PD_METRICS,
} from "@/constants/pd-model-config";
import { getRatingOrder } from "@/lib/pd-model-utils";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

const EADModelOutput = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const dataName = searchParams.get("name");
  const timeStamp = searchParams.get("time");
  const id = params?.slug as string;

  const [activeTab, setActiveTab] = useState("EAD Actual");
  const [pageNumber, setPageNumber] = useState(1);

  const itemsPerPage = 10;
  const shouldShowPDMetrics = TABS_WITH_PD_METRICS.includes(activeTab);

  const buildQueryString = () => {
    const baseQuery = `model_execution_id=${id}&file_name=${getFileNameFromTab(
      activeTab,
    )}&page=${pageNumber}&limit=${itemsPerPage}`;

    return baseQuery;
  };

  // Fetch data
  const { data, isLoading } = useGet<PDModelOutputApiResponse>(
    ["pd-model-output", id, activeTab, pageNumber.toString()],
    `/reporting/models/pd?${buildQueryString()}`,
  );

  // Export URLs
  const fileUrl = `/models/${id}/output?model_type=PD`;
  const emailExportApiUrl = `/reporting/email/models/pd?model_execution_id=${id}&file_name=${getFileNameFromTab(activeTab)}`;

  const transformedData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return [];

    const allRows: { [key: string]: React.ReactNode; _rating?: string }[] = [];

    data.data.forEach((item: PDModelOutputApiResponseItem) => {
      item.file_content.forEach((content: FileContentItem) => {
        const row: { [key: string]: React.ReactNode; _rating?: string } = {
          rating: (
            <span className="text-[#003A1B] font-medium">{content.Rating}</span>
          ),
          _rating: content.Rating, // Store raw rating for sorting
        };

        Object.keys(content).forEach((key) => {
          if (!EXCLUDED_KEYS.includes(key)) {
            if (
              key.toLowerCase().includes("pd") &&
              key.toLowerCase().includes("metrics") &&
              !shouldShowPDMetrics
            ) {
              return;
            }

            const value = content[key];
            const formattedValue = formatPDValue(value);
            row[key] = <span className="text-[#444846]">{formattedValue}</span>;
          }
        });

        allRows.push(row);
      });
    });

    // Sort rows by rating order
    return allRows.sort((a, b) => {
      const ratingA = getRatingOrder(a._rating || "");
      const ratingB = getRatingOrder(b._rating || "");
      return ratingA - ratingB;
    });
  }, [data, shouldShowPDMetrics]);

  // Generate dynamic columns from API data
  const getColumns = () => {
    const baseColumns = [
      { key: "rating", label: "Rating", width: "w-[180px]" },
    ];

    if (!data?.data || data.data.length === 0) {
      // Return default columns if no data
      DEFAULT_COLUMNS.forEach((col) => {
        // Skip PD Metrics column if not in combo metrics tabs
        if (
          col.toLowerCase().includes("pd") &&
          col.toLowerCase().includes("metrics") &&
          !shouldShowPDMetrics
        ) {
          return;
        }

        baseColumns.push({
          key: col,
          label: formatColumnHeader(col),
          width: "w-[100px]",
        });
      });
      return baseColumns;
    }

    // Dynamically create columns based on the first file_content item
    const firstItem = data.data[0];
    if (!firstItem.file_content || firstItem.file_content.length === 0) {
      return baseColumns;
    }

    const firstContent = firstItem.file_content[0];

    Object.keys(firstContent).forEach((key) => {
      if (!EXCLUDED_KEYS.includes(key)) {
        // Skip PD Metrics column if not in combo metrics tabs
        if (key.includes("PD_Metric") && !shouldShowPDMetrics) {
          return;
        }

        baseColumns.push({
          key: key,
          label: formatColumnHeader(key),
          width: "w-[100px]",
        });
      }
    });

    return baseColumns;
  };

  // Get empty message based on active tab
  const getEmptyMessage = () => {
    const tabLabel = TAB_LABELS[activeTab] || "data";
    return `No ${tabLabel} data available`;
  };

  // Render tab content with loading state
  const renderTabContent = (content: React.ReactNode) => {
    if (isLoading) {
      return <LoadingSpinner loadingText="Loading PD Data..." />;
    }
    return content;
  };

  // Render table and pagination
  const renderTableWithPagination = () => (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <CustomTable
          columns={getColumns()}
          rows={transformedData}
          tableHeaderClassName="bg-[#F9FAFB]"
          emptyMessage={getEmptyMessage()}
        />
      </div>
      {data?.data && data.data.length > 0 && (
        <div className="mt-6">
          <Pagination
            totalCount={data.total_count || 1}
            activePage={String(data.page || 1)}
            setPageNumber={setPageNumber}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </>
  );

  // Tab configuration
  const tabOptions = [
    {
      value: "EAD Actual",
      label: "EAD Actual",
      content: renderTabContent(renderTableWithPagination()),
    },
    {
      value: "EAD Principal",
      label: "EAD Principal",
      content: renderTabContent(renderTableWithPagination()),
    },
    {
      value: "EAD Coupon",
      label: "EAD Coupon",
      content: renderTabContent(renderTableWithPagination()),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Link
        href="#"
        onClick={() => router.back()}
        className="me-auto rounded-md border flex items-center  justify-center w-[28px] h-[28px] text-sm text-[#667085]"
      >
        <ChevronLeft className=" w-5 h-5" />
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.4rem] text-[#111827] font-[700]">
            EAD Model Report - File6765
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full EAD report
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Export Trigger */}
          <ExportTrigger
            exportApiUrl={fileUrl}
            exportFileName={`${dataName}_${formatDate(timeStamp)}_PD_Model`}
            emailExportApiUrl={emailExportApiUrl}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <CustomTabs
        defaultValue={activeTab}
        options={tabOptions}
        onValueChange={(value) => {
          setActiveTab(value);
          setPageNumber(1);
        }}
        className="border-none"
        triggerClassName="max-w-fit"
      />
    </div>
  );
};

export default EADModelOutput;
