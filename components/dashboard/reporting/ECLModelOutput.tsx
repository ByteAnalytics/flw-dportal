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
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
} from "@/lib/utils";
import { ECLApiItem, ECLDfRow } from "@/types/reporting";
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

// Scenario label used in ecl_df_all_scenario data
const TAB_TO_SCENARIO_LABEL: Record<TabValue, string | null> = {
  ecl: null,
  baseline: "Baseline",
  "best-case": "Best Case",
  "worst-case": "Worst Case",
};

// Static columns for scenario tabs (non-date fields)
const SCENARIO_STATIC_KEYS = [
  // "Scenario",
  "Counter Party",
  "Grouped Asset",
  "Rating",
  "Stage",
  "ECL",
] as const;

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
  const scenarioLabel = TAB_TO_SCENARIO_LABEL[activeTab];
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

  // ecl_df_all_scenario rows filtered by the current scenario label
  const allScenarioRaw = eclItem?.ecl_df_all_scenario?.data ?? [];
  const scenarioRows = useMemo(() => {
    if (!scenarioLabel) return [];
    return allScenarioRaw.filter((row) => row["Scenario"] === scenarioLabel);
  }, [allScenarioRaw, scenarioLabel]);

  // Dynamically extract date column keys from the first scenario row
  const dateColumnKeys = useMemo(() => {
    const firstRow = scenarioRows[0] ?? allScenarioRaw[0];
    if (!firstRow) return [];
    return Object.keys(firstRow).filter((key) =>
      /^\d{4}-\d{2}-\d{2}$/.test(key),
    );
  }, [scenarioRows, allScenarioRaw]);

  // Build columns for scenario table: static fields + date columns
  const scenarioTableColumns = useMemo(() => {
    const staticCols = SCENARIO_STATIC_KEYS.map((key) => ({
      key,
      label: key,
    }));
    const dateCols = dateColumnKeys.map((key) => ({ key, label: key }));
    return [...staticCols, ...dateCols];
  }, [dateColumnKeys]);

  // Build rows for scenario table
  const scenarioTableRows = useMemo(() => {
    return scenarioRows.map((item) => {
      const row: Record<string, React.ReactNode> = {
        // Scenario: <span className="text-[#444846]">{item["Scenario"]}</span>,
        "Counter Party": (
          <span className="text-[#003A1B] font-medium">
            {item["Counter Party"]}
          </span>
        ),
        "Grouped Asset": (
          <span className="text-[#444846]">{item["Grouped Asset"]}</span>
        ),
        Rating: <span className="text-[#444846]">{item["Rating"]}</span>,
        Stage: (
          <span className="text-[#444846]">
            {item["Stage"] !== undefined ? `Stage ${item["Stage"]}` : "-"}
          </span>
        ),
        ECL: (
          <span className="text-[#444846]">
            {formatCurrency(Number(item["ECL"] ?? 0))}
          </span>
        ),
      };

      // Add date columns
      dateColumnKeys.forEach((dateKey) => {
        row[dateKey] = (
          <span className="text-[#444846]">
            {formatCurrency(
              Number(
                (item as unknown as Record<string, unknown>)[dateKey] ?? 0,
              ),
            )}
          </span>
        );
      });

      return row;
    });
  }, [scenarioRows, dateColumnKeys]);

  const activeScenarioSummary = summaryKey ? eclSummary?.[summaryKey] : null;
  const weightedSummary =
    eclItem?.dashboard_summary?.report_summary_page?.weighted_summary_df?.[0];

  // ECL tab table rows (unchanged)
  const eclTableRows = useMemo(() => {
    return rawRows.map((item) => ({
      "Counter Party": (
        <span className="text-[#003A1B] font-medium">
          {item["Counter Party"]}
        </span>
      ),
      "Carrying Amount": (
        <span className="text-[#444846]">
          {formatCurrency(Number(item["Carrying Amount"]))}
        </span>
      ),
      Baseline: (
        <span className="text-[#444846]">
          {formatCurrency(Number(item.Baseline))}
        </span>
      ),
      "Best Case": (
        <span className="text-[#444846]">
          {formatCurrency(Number(item["Best Case"]))}
        </span>
      ),
      "Worst Case": (
        <span className="text-[#444846]">
          {formatCurrency(Number(item["Worst Case"]))}
        </span>
      ),
      "Probability Weighted ECL": (
        <span className="text-[#444846]">
          {formatCurrency(Number(item["Probability Weighted ECL"]))}
        </span>
      ),
      "ECL with Scalar": (
        <span className="text-[#444846]">
          {formatCurrency(Number(item["ECL with Scalar"]))}
        </span>
      ),
      "ECL Ratio": (
        <span className="text-[#444846]">
          {formatPercentage(item["ECL Ratio"])}
        </span>
      ),
    }));
  }, [rawRows]);

  const fileUrl = `/crr/${id}/output`;
  const emailExportApiUrl = `/guarantees/email?model_name=${extractModelType(data?.data?.model_type ?? "")}&model_execution_id=${id}`;

  const renderEclTabCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
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

  const renderSummaryCards = () =>
    isEclTab ? renderEclTabCards() : renderScenarioCards();

  const tableColumns = isEclTab ? ECL_PER_ASSET_COLUMNS : scenarioTableColumns;
  const tableRows = isEclTab ? eclTableRows : scenarioTableRows;
  const emptyMessage = `No ${activeTabConfig.label} data available`;

  const tabOptions = TAB_CONFIG.map((tab) => ({
    value: tab.value,
    label: tab.label,
    content:
      tab.value === activeTab ? (
        isLoading ? (
          <LoadingSpinner loadingText="Loading ECL Data..." />
        ) : (
          <div>
            {renderSummaryCards()}
            <div className="bg-white mt-6 rounded-xl border border-gray-200 overflow-hidden">
              <CustomTable
                columns={tableColumns}
                rows={tableRows}
                tableHeaderClassName="bg-[#F9FAFB]"
                emptyMessage={emptyMessage}
              />
            </div>
            {/* Pagination: ECL tab uses ecl_per_asset pagination; scenario tabs use scenarioRows length */}
            {isEclTab
              ? (pagedData?.total_logs ?? 0) > 0 && (
                  <div className="mt-6">
                    <Pagination
                      totalCount={pagedData?.total_logs ?? 0}
                      activePage={String(pagedData?.current_page ?? 1)}
                      setPageNumber={setPageNumber}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />
                  </div>
                )
              : scenarioRows.length > 0 && (
                  <div className="mt-6">
                    <Pagination
                      totalCount={
                        eclItem?.ecl_df_all_scenario?.total_logs ??
                        scenarioRows.length
                      }
                      activePage={String(pageNumber)}
                      setPageNumber={setPageNumber}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />
                  </div>
                )}
          </div>
        )
      ) : null,
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
          {/* <h1 className="text-[1.4rem] text-[#111827] font-[700]">
            ECL Model Report - {dataName ?? id}
          </h1> */}
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
