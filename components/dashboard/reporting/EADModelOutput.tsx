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
import { formatDate, formatNumber, getFileNameFromTab } from "@/lib/utils";
import { EADApiItem } from "@/types/reporting";
import { ApiResponse } from "@/types";
import { EAD_TABS } from "@/constants/ead-model-config";

const ITEMS_PER_PAGE = 10;

const EADModelOutput = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.slug as string;
  const dataName = searchParams.get("name");
  const timeStamp = searchParams.get("time");

  const [activeTab, setActiveTab] = useState("EAD Actual");
  const [pageNumber, setPageNumber] = useState(1);

  const activeApiType =
    EAD_TABS.find((t) => t.value === activeTab)?.apiType ?? "actual";

  const { data, isLoading } = useGet<ApiResponse<EADApiItem>>(
    ["ead-model-output", id, activeTab, pageNumber.toString()],
    `/guarantees/runs/${id}/result?ead_type=${activeApiType}&page=${pageNumber}&page_size=${ITEMS_PER_PAGE}`,
  );

  const eadDf = data?.data?.ead_df;
  const eadRows = eadDf?.data ?? [];

  const columns = useMemo(() => {
    if (eadRows.length === 0)
      return [{ key: "Obligor", label: "OBLIGOR", width: "w-[200px]" }];

    return Object.keys(eadRows[0]).map((key) => ({
      key,
      label: key === "Obligor" ? "OBLIGOR" : key,
      width: key === "Obligor" ? "w-[200px]" : "w-[130px]",
    }));
  }, [eadRows]);

  const tableRows = useMemo(() => {
    return eadRows.map((item) => {
      const row: Record<string, React.ReactNode> = {};

      Object.entries(item).forEach(([key, value]) => {
        if (key === "Obligor") {
          row[key] = (
            <span className="text-[#003A1B] font-medium">
              {value as string}
            </span>
          );
        } else {
          row[key] = (
            <span className="text-[#444846]">
              {formatNumber((value as number) ?? 0)}
            </span>
          );
        }
      });

      return row;
    });
  }, [eadRows]);

  const fileUrl = `/crr/${id}/output`;
  const emailExportApiUrl = `/reporting/email/models/ead?model_execution_id=${id}&file_name=${getFileNameFromTab(activeTab)}`;

  const renderTableWithPagination = () => {
    if (isLoading) return <LoadingSpinner loadingText="Loading EAD Data..." />;

    return (
      <>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CustomTable
            columns={columns}
            rows={tableRows}
            tableHeaderClassName="bg-[#F9FAFB]"
            emptyMessage={`No ${activeTab} data available`}
          />
        </div>

        {(eadDf?.total_logs ?? 0) > 0 && (
          <div className="mt-6">
            <Pagination
              totalCount={eadDf?.total_logs ?? 0}
              activePage={String(eadDf?.current_page ?? 1)}
              setPageNumber={setPageNumber}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        )}
      </>
    );
  };

  const tabOptions = EAD_TABS.map((tab) => ({
    value: tab.value,
    label: tab.label,
    content: renderTableWithPagination(),
  }));

  return (
    <div className="space-y-6">
      <Link
        href="#"
        onClick={() => router.back()}
        className="me-auto rounded-md border flex items-center justify-center w-[28px] h-[28px] text-sm text-[#667085]"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.4rem] text-[#111827] font-[700]">
            EAD Model Report - {dataName ?? id}
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full EAD report
          </p>
        </div>

        <div className="ms-auto">
          <ExportTrigger
            exportApiUrl={fileUrl}
            emailExportApiUrl={emailExportApiUrl}
            exportFileName={`${dataName}_${formatDate(timeStamp)}_EAD_Model`}
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

export default EADModelOutput;
