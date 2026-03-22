"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import CustomTable from "@/components/ui/custom-table";
import { CustomTabs } from "@/components/shared/CustomTab";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatCard } from "@/components/shared/StatCard";
import { useGet } from "@/hooks/use-queries";
import { formatDate } from "@/lib/utils";
import { FLIApiItem } from "@/types/reporting";
import { ApiResponse } from "@/types";
import { CustomerSvg, EadSvg, EclSvg } from "@/svg";
import {
  FLI_COLUMNS,
  ITEMS_PER_PAGE,
  TAB_CONFIG,
} from "@/constants/fli-details-config";

type TabValue = (typeof TAB_CONFIG)[number]["value"];
type FLIScenarioRow = FLIApiItem["fli_scenarios_pd"]["data"][number];

// const formatScenarioValue = (value: number) => `${(value * 100).toFixed(4)}%`;

const FLIModelOutput = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.slug as string;
  const dataName = searchParams.get("name");
  const timeStamp = searchParams.get("time");

  const [activeTab, setActiveTab] = useState<TabValue>("fli-pd");
  const [pageNumber, setPageNumber] = useState(1);

  const activeDataKey = TAB_CONFIG.find((t) => t.value === activeTab)!.dataKey;

  const { data, isLoading } = useGet<ApiResponse<FLIApiItem>>(
    ["fli-model-output", id, activeTab, pageNumber.toString()],
    `/guarantees/runs/${id}/result?tab=${activeDataKey}&page=${pageNumber}&page_size=${ITEMS_PER_PAGE}`,
  );

  const fliItem = data?.data;
  const scenarioWeights = fliItem?.scenario_weights;
  const activeTabData = fliItem?.[activeDataKey];
  const rawRows: FLIScenarioRow[] = activeTabData?.data ?? [];

  const tableRows = useMemo(() => {
    return rawRows.map((item) => ({
      Year: <span className="text-[#003A1B] font-medium">{item.Year}</span>,
      "Best Case": (
        <span className="text-[#444846]">
          {item["Best Case"]}
        </span>
      ),
      Baseline: (
        <span className="text-[#444846]">
          {item.Baseline}
        </span>
      ),
      "Worst Case": (
        <span className="text-[#444846]">
          {item["Worst Case"]}
        </span>
      ),
      Probability_Weighted: (
        <span className="text-[#444846]">
          {item.Probability_Weighted}
        </span>
      ),
    }));
  }, [rawRows]);

  const fileUrl = `/crr/${id}/output`;
  const emailExportApiUrl = `/reporting/email/models/fli?model_execution_id=${id}`;

  const renderTableWithPagination = () => {
    if (isLoading) return <LoadingSpinner loadingText="Loading FLI Data..." />;

    return (
      <>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CustomTable
            columns={FLI_COLUMNS}
            rows={tableRows}
            tableHeaderClassName="bg-[#F9FAFB]"
            emptyMessage={`No ${TAB_CONFIG.find((t) => t.value === activeTab)?.label} data available`}
          />
        </div>

        {(activeTabData?.total_logs ?? 0) > 0 && (
          <div className="mt-6">
            <Pagination
              totalCount={activeTabData?.total_logs ?? 0}
              activePage={String(activeTabData?.current_page ?? 1)}
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
            FLI Model Report - {dataName ?? id}
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full FLI report
          </p>
        </div>
        <div className="ms-auto">
          <ExportTrigger
            exportApiUrl={fileUrl}
            emailExportApiUrl={emailExportApiUrl}
            exportFileName={`${dataName}_${formatDate(timeStamp)}_FLI_Model`}
          />
        </div>
      </div>

      {scenarioWeights && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            title="Best Case Weights"
            icon={<CustomerSvg />}
            value={scenarioWeights.best_case_weight
              ?.map((w) => `${(w )?.toFixed(4)}`)
              ?.join(", ")}
          />
          <StatCard
            title="Base Case Weights"
            icon={<EadSvg />}
            value={scenarioWeights.base_case_weight
              .map((w) => `${(w).toFixed(4)}`)
              .join(", ")}
          />
          <StatCard
            title="Worst Case Weights"
            icon={<EclSvg />}
            value={scenarioWeights.worst_case_weight
              .map((w) => `${(w).toFixed(4)}`)
              .join(", ")}
          />
        </div>
      )}

      <CustomTabs
        defaultValue={activeTab}
        options={tabOptions}
        onValueChange={(value) => {
          setActiveTab(value as TabValue);
          setPageNumber(1);
        }}
        className="border-none"
        triggerClassName="max-w-fit"
      />
    </div>
  );
};

export default FLIModelOutput;
