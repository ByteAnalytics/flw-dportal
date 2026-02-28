"use client";

import React, { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { ChevronLeft } from "lucide-react";

import CustomTable from "@/components/ui/custom-table";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useDynamicDelete, useGet } from "@/hooks/use-queries";
import {
  eclformatColumnHeader,
  formatCurrency,
  formatDate,
  formatPercentage,
} from "@/lib/utils";
import {
  ECLApiResponse,
  ECLApiResponseItem,
  ECLFileContentItem,
  ECLStatisticsData,
  ECLStatisticsFilteredData,
} from "@/types/reporting";
import { ApiResponse } from "@/types";
import {
  COLUMN_WIDTHS,
  DEFAULT_COLUMNS,
  IMPORTANT_COLUMNS,
} from "@/constants/ecl-model-config";
import {
  createStatsData,
} from "@/lib/ecl-model-utils";
import { CustomTabs } from "@/components/shared/CustomTab";
import Link from "next/link";
import { StatCard } from "@/components/shared/StatCard";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ECLModelOutput: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.slug as string;
  const dataName = searchParams.get("name");
  const timeStamp = searchParams.get("time");

  const itemsPerPage = 10;

  const [pageNumber, setPageNumber] = useState(1);
  const [activeTab, setActiveTab] = useState("ecl");

  // Build query string for API
  const buildQueryString = () => {
    let query = `model_execution_id=${id}&page=${pageNumber}&page_size=${itemsPerPage}`;

    return query;
  };

  // Fetch ECL data
  const { data, isLoading } = useGet<ECLApiResponse>(
    ["ecl-model-output", id, pageNumber.toString()],
    `/reporting/models/ecl?${buildQueryString()}`,
  );

  // Fetch statistics data
  const { data: statisticsData } = useGet<{ data: ECLStatisticsData }>(
    ["ecl-statistics", id],
    `/reporting/models/dashboard?model_execution_id=${id}&section=ecl_summary&page_size=${itemsPerPage}`,
    { enabled: !!id },
  );

  // Fetch filtered statistics data (when portfolio filter is applied)
  const { data: statisticsFilterData } = useGet<{
    data: ECLStatisticsFilteredData;
  }>(
    ["ecl-statistics-filter", id],
    `/reporting/models/dashboard?model_execution_id=${id}&section=total_cust_per_loan_class_and_stage`,
    { enabled: !!id },
  );

  const discardMutation = useDynamicDelete<ApiResponse<any>>();

  // Export URLs
  const fileUrl = `/models/${id}/output?model_type=ECL`;
  const emailExportApiUrl = `/reporting/email/models/ecl?model_execution_id=${id}`;

  // Calculate main statistics
  const statsData = useMemo(() => {
    if (!statisticsData?.data) {
      return createStatsData(0, 0, 0, 0, 0);
    }

    const { ecl_totals } = statisticsData.data;
    const { ecl_summary } = ecl_totals;

    return createStatsData(
      ecl_summary["Total ECL"],
      ecl_summary["ECL Stage 1"],
      ecl_summary["ECL Stage 2"],
      ecl_summary["ECL Stage 3"],
      500000,
    );
  }, [statisticsData, statisticsFilterData]);

  // Transform data for table display
  const tableRows = useMemo(() => {
    if (!data?.data || data.data.length === 0) return [];

    const allRows: { [key: string]: React.ReactNode }[] = [];

    data.data.forEach((item: ECLApiResponseItem) => {
      item.file_content.forEach((content: ECLFileContentItem) => {
        const row: { [key: string]: React.ReactNode } = {
          "LOAN UNIQUE ID": (
            <span className="text-[#003A1B] font-medium">
              {content["LOAN UNIQUE ID"]}
            </span>
          ),
          "CLIENT NAME": (
            <span className="text-[#003A1B] font-medium">
              {content["CLIENT NAME"]}
            </span>
          ),
          "FUND TYPE": (
            <span className="text-[#444846]">{content["FUND TYPE"]}</span>
          ),
          LOAN_TYPE: (
            <span className="text-[#444846]">{content["LOAN_TYPE"]}</span>
          ),
          "PRINCIPAL LOAN AMOUNT": (
            <span className="text-[#444846] font-medium">
              {formatCurrency(content["PRINCIPAL LOAN AMOUNT"] as number)}
            </span>
          ),
          EAD: (
            <span className="text-[#444846]">
              {formatCurrency(content["EAD"] as number)}
            </span>
          ),
          STAGE: <span>{content["STAGE"]}</span>,
          "FINAL ECL": (
            <span className="text-[#444846] font-semibold">
              {formatCurrency(content["FINAL ECL"] as number)}
            </span>
          ),
          "FINAL LGD": (
            <span className="text-[#444846]">
              {formatPercentage(content["FINAL LGD"] as number)}
            </span>
          ),
          "EFFECTIVE INT RATE (%)": (
            <span className="text-[#444846]">
              {formatPercentage(
                (content["EFFECTIVE INT RATE (%)"] as number) / 100,
              )}
            </span>
          ),
          "DISBURSEMENT DATE (MM/DD/YYYY)": (
            <span className="text-[#444846]">
              {formatDate(content["DISBURSEMENT DATE (MM/DD/YYYY)"] as string)}
            </span>
          ),
          "EXPIRY DATE (MM/DD/YYYY)": (
            <span className="text-[#444846]">
              {formatDate(content["EXPIRY DATE (MM/DD/YYYY)"] as string)}
            </span>
          ),
          REPAYMENT_FREQUENCY: (
            <span className="text-[#444846]">
              {content["REPAYMENT_FREQUENCY"]}
            </span>
          ),
          PMT: (
            <span className="text-[#444846]">
              {formatCurrency(content["PMT"] as number)}
            </span>
          ),
        };

        allRows.push(row);
      });
    });

    return allRows;
  }, [data]);

  // Generate columns
  const getColumns = () => {
    if (!data?.data || data.data.length === 0) {
      return DEFAULT_COLUMNS;
    }

    const firstItem = data.data[0];
    if (!firstItem.file_content || firstItem.file_content.length === 0) {
      return DEFAULT_COLUMNS;
    }

    return IMPORTANT_COLUMNS.map((key) => ({
      key,
      label: eclformatColumnHeader(key),
      width: COLUMN_WIDTHS[key] || "w-[120px]",
    }));
  };

  const tabContent = useMemo(() => {
    return (
      <div className="space-y-6">
        {/* ECL Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {statsData.map((stat, i) => (
            <StatCard key={`ecl-${i}`} {...stat} />
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <CustomTable
              columns={getColumns()}
              rows={tableRows}
              tableHeaderClassName="bg-[#F9FAFB]"
              emptyMessage="No ECL data available"
            />
          </div>
        </div>

        {/* Pagination */}
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
      </div>
    );
  }, [tableRows, statsData]);

  const renderTabContent = (content: React.ReactNode) => {
    if (isLoading) {
      return <LoadingSpinner loadingText="Fetching Reports..." />;
    }
    return content;
  };

  // In your Reporting component, update the tabOptions to pass currentTab:
  const tabOptions = [
    {
      value: "ecl",
      label: "ECL",
      content: renderTabContent(<>{tabContent}</>),
    },
    {
      value: "baseline",
      label: "Baseline",
      content: renderTabContent(<>{tabContent}</>),
    },
    {
      value: "fli-model",
      label: "FLI Scalar",
      content: renderTabContent(<>{tabContent}</>),
    },
    {
      value: "best-case",
      label: "Best Case",
      content: renderTabContent(<>{tabContent}</>),
    },
    {
      value: "worst-case",
      label: "Worst Case",
      content: renderTabContent(<>{tabContent}</>),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[1.4rem] font-bold text-[#003A1B]">
            ECL Model Output
          </h1>
        </div>
        <LoadingSpinner loadingText="Loading ECL Data..." />
      </div>
    );
  }

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.4rem] font-bold text-[#003A1B]">
            ECL Model Report - File6765
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full ECL report
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Export Trigger */}
          <ExportTrigger
            exportApiUrl={fileUrl}
            emailExportApiUrl={emailExportApiUrl}
            exportFileName={`${dataName}_${formatDate(timeStamp)}_ECL_Model`}
          />
        </div>
      </div>
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

export default ECLModelOutput;
