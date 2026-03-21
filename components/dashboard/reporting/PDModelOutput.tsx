"use client";

import React, { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import CustomTable from "@/components/ui/custom-table";
import { CustomTabs } from "@/components/shared/CustomTab";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useGet } from "@/hooks/use-queries";
import {
  formatDate,
  getFileNameFromTab,
  formatColumnHeader,
} from "@/lib/utils";
import { PDApiItem } from "@/types/reporting";
import { ApiResponse } from "@/types";
import {
  EXCLUDED_KEYS,
  ITEMS_PER_PAGE,
  MONTHLY_TAB_METRIC_MAP,
  TAB_CONFIG,
  YEARLY_TAB_METRIC_MAP,
} from "@/constants/pd-model-config";

const PDModelOutput = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.slug as string;
  const dataName = searchParams.get("name");
  const timeStamp = searchParams.get("time");

  const [activeTab, setActiveTab] = useState("Annual_Conditional_PD");
  const [pageNumber, setPageNumber] = useState(1);

  const activeTabConfig = TAB_CONFIG.find((t) => t.value === activeTab)!;
  const isYearly = activeTabConfig?.type === "yearly";

  const metricFilter = !isYearly
    ? MONTHLY_TAB_METRIC_MAP?.[activeTab]
    : YEARLY_TAB_METRIC_MAP[activeTab];

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.set("page", String(pageNumber));
    params.set("page_size", String(ITEMS_PER_PAGE));
    if (metricFilter) params.set("pd_metric", metricFilter);
    return params.toString();
  };

  const { data, isLoading } = useGet<ApiResponse<PDApiItem>>(
    [
      "pd-model-output",
      id,
      activeTab,
      pageNumber.toString(),
      metricFilter ?? "",
    ],
    `/guarantees/runs/${id}/result?${buildQueryString()}`,
  );

  const pdItem = data?.data;

  const rawRows = useMemo(() => {
    if (!pdItem) return [];
    if (isYearly) return pdItem.pd_yearly_combo_metrics?.data ?? [];
    return pdItem.pd_monthly_combo_metrics?.data ?? [];
  }, [pdItem, isYearly]);

  const paginatedMeta = useMemo(() => {
    if (!pdItem) return { total_logs: 0, current_page: 1 };
    if (isYearly) {
      return {
        total_logs: pdItem.pd_yearly_combo_metrics?.total_logs ?? 0,
        current_page: pdItem.pd_yearly_combo_metrics?.current_page ?? 1,
      };
    }
    return {
      total_logs: pdItem.total_logs ?? 0,
      current_page: pdItem.current_page ?? 1,
    };
  }, [pdItem, isYearly]);

  const columns = useMemo(() => {
    if (rawRows.length === 0) return [];

    return Object.keys(rawRows[0])
      .filter((key) => !EXCLUDED_KEYS.includes(key))
      .map((key) => ({
        key,
        label: formatColumnHeader(key),
        width:
          key === "Rating" || key === "PD_Metric" || key === "Scenario"
            ? "w-[180px]"
            : "w-[100px]",
      }));
  }, [rawRows]);

  const tableRows = useMemo(() => {
    return rawRows.map((item) => {
      const row: Record<string, React.ReactNode> = {};

      Object.entries(item).forEach(([key, value]) => {
        if (EXCLUDED_KEYS.includes(key)) return;

        if (key === "Rating") {
          row[key] = (
            <span className="text-[#003A1B] font-medium">
              {value as string}
            </span>
          );
        } else if (key === "PD_Metric" || key === "Scenario") {
          row[key] = (
            <span className="text-[#444846] font-medium">
              {value as string}
            </span>
          );
        } else {
          row[key] = (
            <span className="text-[#444846]">
              {typeof value === "number"
                ? `${(value * 100).toFixed(4)}%`
                : (value as string)}
            </span>
          );
        }
      });

      return row;
    });
  }, [rawRows]);

  const fileUrl = `/crr/${id}/output`;
  const emailExportApiUrl = `/reporting/email/models/pd?model_execution_id=${id}&file_name=${getFileNameFromTab(activeTab)}`;

  const renderTableWithPagination = () => {
    if (isLoading) return <LoadingSpinner loadingText="Loading PD Data..." />;

    return (
      <>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CustomTable
            columns={columns}
            rows={tableRows}
            tableHeaderClassName="bg-[#F9FAFB]"
            emptyMessage={`No ${activeTabConfig?.label} data available`}
          />
        </div>

        {paginatedMeta.total_logs > 0 && (
          <div className="mt-6">
            <Pagination
              totalCount={paginatedMeta.total_logs}
              activePage={String(paginatedMeta.current_page)}
              setPageNumber={setPageNumber}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        )}
      </>
    );
  };

  const tabOptions = TAB_CONFIG.map((tab) => ({
    value: tab.value,
    label: tab.label,
    content: renderTableWithPagination(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="#"
          onClick={() => router.back()}
          className="me-auto rounded-md border flex items-center justify-center w-[28px] h-[28px] text-sm text-[#667085]"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.4rem] text-[#111827] font-[700]">
            PD Model Report - {dataName ?? id}
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full PD report
          </p>
        </div>

        <div className="ms-auto">
          <ExportTrigger
            exportApiUrl={fileUrl}
            exportFileName={`${dataName}_${formatDate(timeStamp)}_PD_Model`}
            emailExportApiUrl={emailExportApiUrl}
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

export default PDModelOutput;
