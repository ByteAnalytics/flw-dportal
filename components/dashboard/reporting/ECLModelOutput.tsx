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
import { StatCard } from "@/components/shared/StatCard";
import { useGet } from "@/hooks/use-queries";
import { formatDate, formatNumber } from "@/lib/utils";
import { ECLApiItem } from "@/types/reporting";
import { ApiResponse } from "@/types";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import {
  ECL_PER_ASSET_COLUMNS,
  ITEMS_PER_PAGE,
  TAB_CONFIG,
} from "@/constants/ecl-model-config";
import { extractModelType } from "@/lib/model-execution-utils";

type TabValue = (typeof TAB_CONFIG)[number]["value"];
type SummaryKey = "Baseline" | "Best Case" | "Worst Case";

const TAB_TO_SUMMARY_KEY: Record<TabValue, SummaryKey | null> = {
  ecl: null,
  baseline: "Baseline",
  "best-case": "Best Case",
  "worst-case": "Worst Case",
};

const ECLModelOutput: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.slug as string;
  const dataName = searchParams.get("name");
  const timeStamp = searchParams.get("time");

  const [activeTab, setActiveTab] = useState<TabValue>("ecl");
  const [pageNumber, setPageNumber] = useState(1);

  const activeTabConfig = TAB_CONFIG.find((t) => t.value === activeTab)!;
  const summaryKey = TAB_TO_SUMMARY_KEY[activeTab];
  const isEclTab = activeTab === "ecl";

  const buildQueryString = () => {
    const p = new URLSearchParams();
    p.set("page", String(pageNumber));
    p.set("page_size", String(ITEMS_PER_PAGE));
    if (activeTabConfig.scenario) {
      p.set("scenario", activeTabConfig.scenario);
    }
    return p.toString();
  };

  const { data, isLoading } = useGet<ApiResponse<ECLApiItem>>(
    ["ecl-model-output", id, activeTab, pageNumber.toString()],
    `/guarantees/runs/${id}/result?${buildQueryString()}`,
  );



  const eclItem = data?.data;

  const eclSummary = eclItem?.ecl_summary;
  const pagedData = eclItem?.ecl_per_asset;
  const rawRows = pagedData?.data ?? [];

  const activeScenarioSummary = summaryKey ? eclSummary?.[summaryKey] : null;

  const weightedSummary =
    eclItem?.dashboard_summary?.report_summary_page?.weighted_summary_df?.[0];

  const tableRows = useMemo(() => {
    return rawRows.map((item) => ({
      "Counter Party": (
        <span className="text-[#003A1B] font-medium">
          {item["Counter Party"]}
        </span>
      ),
      "Carrying Amount": (
        <span className="text-[#444846]">
          {item["Carrying Amount"].toFixed(4)}
        </span>
      ),
      Baseline: (
        <span className="text-[#444846]">{item.Baseline.toFixed(4)}</span>
      ),
      "Best Case": (
        <span className="text-[#444846]">{item["Best Case"].toFixed(4)}</span>
      ),
      "Worst Case": (
        <span className="text-[#444846]">{item["Worst Case"].toFixed(4)}</span>
      ),
      "Probability Weighted ECL": (
        <span className="text-[#444846]">
          {item["Probability Weighted ECL"].toFixed(4)}
        </span>
      ),
      "ECL with Scalar": (
        <span className="text-[#444846]">
          {item["ECL with Scalar"].toFixed(4)}
        </span>
      ),
      "ECL Ratio": (
        <span className="text-[#444846]">{item["ECL Ratio"].toFixed(4)}</span>
      ),
    }));
  }, [rawRows]);

  const fileUrl = `/crr/${id}/output`;
  const emailExportApiUrl = `/guarantees/email?model_name=${extractModelType(data?.data?.model_type ?? "")}&model_execution_id=${id}`;

  const renderEclTabCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      <StatCard
        title="Total ECL"
        icon={<CustomerSvg />}
        value={formatNumber(weightedSummary?.["OVERALL Weighted ECL"] ?? 0)}
      />
      <StatCard
        title="Stage 1"
        icon={<EclSvg />}
        value={formatNumber(weightedSummary?.["Weighted Stage 1"] ?? 0)}
      />
      <StatCard
        title="Stage 2"
        icon={<LGDSvg />}
        value={formatNumber(weightedSummary?.["Weighted Stage 2"] ?? 0)}
      />
      <StatCard
        title="Stage 3"
        icon={<NPLSvg />}
        value={formatNumber(weightedSummary?.["Weighted Stage 3"] ?? 0)}
      />
    </div>
  );

  const renderScenarioCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
      <StatCard
        title="Total EAD"
        icon={<CustomerSvg />}
        value={formatNumber(activeScenarioSummary?.total_ead ?? 0)}
      />
      <StatCard
        title="Total ECL"
        icon={<EadSvg />}
        value={formatNumber(activeScenarioSummary?.total_ecl ?? 0)}
      />
      <StatCard
        title="Stage 1"
        icon={<EclSvg />}
        value={formatNumber(
          activeScenarioSummary?.summary_per_stage?.["Stage 1"]?.ECL ?? 0,
        )}
        subLabel="EAD:"
        subValue={formatNumber(
          activeScenarioSummary?.summary_per_stage?.["Stage 1"]?.EAD ?? 0,
        )}
      />
      <StatCard
        title="Stage 2"
        icon={<LGDSvg />}
        value={formatNumber(
          activeScenarioSummary?.summary_per_stage?.["Stage 2"]?.ECL ?? 0,
        )}
        subLabel="EAD:"
        subValue={formatNumber(
          activeScenarioSummary?.summary_per_stage?.["Stage 2"]?.EAD ?? 0,
        )}
      />
      <StatCard
        title="Stage 3"
        icon={<NPLSvg />}
        value={formatNumber(
          activeScenarioSummary?.summary_per_stage?.["Stage 3"]?.ECL ?? 0,
        )}
        subLabel="EAD:"
        subValue={formatNumber(
          activeScenarioSummary?.summary_per_stage?.["Stage 3"]?.EAD ?? 0,
        )}
      />
    </div>
  );

  const renderTableWithPagination = () => {
    if (isLoading) return <LoadingSpinner loadingText="Loading ECL Data..." />;

    return (
      <>
        {isEclTab ? renderEclTabCards() : renderScenarioCards()}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CustomTable
            columns={ECL_PER_ASSET_COLUMNS}
            rows={tableRows}
            tableHeaderClassName="bg-[#F9FAFB]"
            emptyMessage={`No ${activeTabConfig.label} data available`}
          />
        </div>

        {(pagedData?.total_logs ?? 0) > 0 && (
          <div className="mt-6">
            <Pagination
              totalCount={pagedData?.total_logs ?? 0}
              activePage={String(pagedData?.current_page ?? 1)}
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
    content: tab.value === activeTab ? renderTableWithPagination() : null,
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
            ECL Model Report - {dataName ?? id}
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full ECL report
          </p>
        </div>
        <div className="ms-auto">
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
          setActiveTab(value as TabValue);
          setPageNumber(1);
        }}
        className="border-none"
        triggerClassName="max-w-fit"
      />
    </div>
  );
};

export default ECLModelOutput;
