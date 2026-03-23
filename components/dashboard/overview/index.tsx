"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { StatCard } from "@/components/shared/StatCard";
import { LoanPerformanceCard } from "./LoanPerformance";
import { CustomerSegmentationCard } from "./CustomerSegmentation";
import { Top20DebtorsTable } from "./TopObligos";
import { useGet } from "@/hooks/use-queries";
import { formatDate, formatNumber, formatPercentage } from "@/lib/utils";
import {
  ChartCardSkeleton,
  StatCardSkeleton,
  TableSkeleton,
} from "@/skeleton/overview";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import { ApiResponse } from "@/types";
import {
  ExecutionModelsResponse,
  ExecutableModels,
} from "@/types/model-execution";
import { DashboardApiItem } from "@/types/overview";

const ITEMS_PER_PAGE = 20;

const MODEL_TYPE = ExecutableModels.ECL;

const DashboardOverviewPage = () => {
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>("");
  const [selectedExecutionLabel, setSelectedExecutionLabel] =
    useState<string>("Filter By Date");

  const { data: logsData, isLoading: logsLoading } = useGet<
    ApiResponse<ExecutionModelsResponse>
  >(
    ["execution-logs-dropdown"],
    `/crr/logs/?page=1&page_size=${ITEMS_PER_PAGE}&model_type=${MODEL_TYPE}`,
    {
      staleTime: 0,
      refetchOnMount: "always",
    },
  );

  const { data: dashboardData, isLoading: dashboardLoading } = useGet<
    ApiResponse<DashboardApiItem>
  >(
    ["ccr-dashboard-overview", selectedExecutionId],
    `/guarantees/dashboard${selectedExecutionId ? `?execution_id=${selectedExecutionId}` : ""}`,
    {
      staleTime: 0,
      refetchOnMount: "always",
    },
  );

  const executionDropdown: DropdownItem[] = useMemo(() => {
    if (!logsData?.data?.model_data) return [];
    return logsData.data.model_data.map((log) => ({
      label: `${formatDate(log.timestamp)}_${log.file_name}`,
      onClick: () => {
        setSelectedExecutionId(log.id);
        setSelectedExecutionLabel(
          `${log.executed_model_type?.toUpperCase()} — ${log.file_name ?? log.id}`,
        );
      },
    }));
  }, [logsData]);

  const portfolioSummary =
    dashboardData?.data?.dashboard_summary?.portfolio_summary;
  const eclSummaryPerScenario =
    dashboardData?.data?.dashboard_summary?.ecl_summary_per_scenario;

  const performingPerc = portfolioSummary?.npl_ratio?.performing_loan_perc ?? 0;
  const nonPerformingPerc =
    portfolioSummary?.npl_ratio?.non_performing_loan_perc ?? 0;

  const isLoading = logsLoading || (!!selectedExecutionId && dashboardLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <TableSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[1.4rem] font-bold text-gray-900">Overview</h1>
          <p className="text-InfraMuted font-[500] text-base">
            View all system metrics
          </p>
        </div>

        <CustomDropdown
          trigger={
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold text-[12px] md:text-[14px] max-w-[260px] truncate"
            >
              <span className="truncate">{selectedExecutionLabel}</span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </Button>
          }
          className="max-w-[200px] sm:max-w-[400px] w-full"
          items={executionDropdown}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCard
          title="Total Customers"
          icon={<CustomerSvg />}
          value={formatNumber(portfolioSummary?.total_customers ?? 0)}
        />
        <StatCard
          title="Total EAD"
          icon={<EadSvg />}
          value={formatNumber(portfolioSummary?.total_ead ?? 0)}
        />
        <StatCard
          title="Total ECL"
          icon={<EclSvg />}
          value={formatNumber(portfolioSummary?.total_ecl ?? 0)}
        />
        <StatCard
          title="Avg LGD"
          icon={<LGDSvg />}
          value={formatPercentage(portfolioSummary?.average_lgd ?? 0)}
        />
        <StatCard
          title="NPL"
          icon={<NPLSvg />}
          value={formatPercentage(nonPerformingPerc)}
        />
      </div>

      <Top20DebtorsTable executionId={selectedExecutionId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LoanPerformanceCard
          performingPercentage={performingPerc}
          nonPerformingPercentage={nonPerformingPerc}
        />
        <CustomerSegmentationCard
          eclSummaryPerScenario={eclSummaryPerScenario}
        />
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
