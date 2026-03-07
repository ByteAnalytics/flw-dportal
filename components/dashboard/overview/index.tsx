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
import { formatNumber, formatPercentage } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartCardSkeleton,
  StatCardSkeleton,
  TableSkeleton,
} from "@/skeleton/overview";
import { DashboardData, defaultDashboardData } from "@/types/overview";
import { Portfolio } from "@/types";
import { ECLStatisticsFilteredData } from "@/types/reporting";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";

const DashboardOverviewPage = () => {
  const [selectedDateInterval, setselectedDateInterval] = useState("");
  const [selectedDateIntervalLabel, setSelectedDateIntervalLabel] =
    useState("This Month");

  const { data: dashboardData, isLoading } = useGet<{ data: DashboardData }>(
    ["dashboard-overview", selectedDateInterval],
    `/reporting/models/dashboard${selectedDateInterval ? `?portfolio=${selectedDateInterval}` : ""}`,
  );

  const { data: dashboardFilterData } = useGet<{
    data: ECLStatisticsFilteredData;
  }>(
    ["dashboard-overview-filter", selectedDateInterval],
    `/reporting/models/dashboard?section=total_cust_per_loan_class_and_stage${selectedDateInterval ? `&metric=${selectedDateInterval}` : ""}`,
    {
      enabled: !!selectedDateInterval,
    },
  );

  const dateDropdown: DropdownItem[] = [
    {
      label: "This Month",
      onClick: () => {
        setselectedDateInterval("");
        setSelectedDateIntervalLabel("This Month");
      },
    },
    {
      label: "This Week",
      onClick: () => {
        setselectedDateInterval(Portfolio.AHF);
        setSelectedDateIntervalLabel("This Week");
      },
    },
    {
      label: "This Year",
      onClick: () => {
        setselectedDateInterval(Portfolio.HTO);
        setSelectedDateIntervalLabel("This Year");
      },
    },
  ];

  const computedData = useMemo(() => {
    if (selectedDateInterval && dashboardFilterData?.data) {
      const {
        total_customer,
        total_ead,
        total_ecl,
        performing_loan_perc,
        non_performing_loan_perc,
        stage_1_summary,
        stage_2_summary,
        stage_3_summary,
      } = dashboardFilterData.data;

      return {
        total_customer,
        total_ead,
        total_ecl,
        performing_loan_perc,
        non_performing_loan_perc,
        ecl_totals: {
          ecl_summary: {
            "ECL Stage 1": stage_1_summary.ECL,
            "ECL Stage 2": stage_2_summary.ECL,
            "ECL Stage 3": stage_3_summary.ECL,
            "Total ECL": total_ecl,
          },
        },
      };
    }

    return dashboardData?.data || defaultDashboardData;
  }, [dashboardData, dashboardFilterData, selectedDateInterval]);

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

  const {
    total_customer,
    total_ead,
    total_ecl,
    performing_loan_perc,
    non_performing_loan_perc,
  } = computedData;

  return (
    <div className="min-h-screen">
      {/* Header */}
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
              className="flex items-center gap-2 text-gray-500 font-semibold text-[12px] md:text-[14px]"
            >
              {selectedDateIntervalLabel}
              <ChevronDown className="w-4 h-4" />
            </Button>
          }
          items={dateDropdown}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCard
          title="Total Customers"
          icon={<CustomerSvg />}
          value={formatNumber(total_customer ?? 0)}
        />
        <StatCard
          icon={<EadSvg />}
          title="Total EAD"
          value={formatNumber(total_ecl ?? 0)}
        />
        <StatCard
          icon={<EclSvg />}
          title="Total ECL"
          value={formatNumber(total_ead ?? 0)}
        />
        <StatCard
          icon={<LGDSvg />}
          title="Avg LGD"
          value={formatNumber(total_ead ?? 0)}
        />
        <StatCard
          icon={<NPLSvg />}
          title="NPL"
          value={formatPercentage(non_performing_loan_perc)}
        />
      </div>

      <Top20DebtorsTable
        filteredObligors={
          selectedDateInterval && dashboardFilterData?.data?.total_obligors
            ? dashboardFilterData.data.total_obligors
            : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LoanPerformanceCard
          performingPercentage={performing_loan_perc ?? 0}
          nonPerformingPercentage={non_performing_loan_perc ?? 0}
        />
        <CustomerSegmentationCard
          selectedDateInterval={selectedDateInterval}
          filteredCustomerCategory={
            selectedDateInterval && dashboardFilterData?.data?.customer_category
              ? dashboardFilterData.data.customer_category
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
