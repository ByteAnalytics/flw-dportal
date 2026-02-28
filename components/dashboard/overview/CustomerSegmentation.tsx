"use client";

import ChartDetailsCard from "@/components/dashboard/overview/ChartDetails";
import { useGet } from "@/hooks/use-queries";
import { ApiResponse } from "@/types";
import React, { useMemo } from "react";
import { ChartCardSkeleton } from "@/skeleton/overview";

interface CustomerSegmentation {
  "LOAN CLASS": string;
  CUSTOMER_CATEGORY: string;
  total_customer: number;
  total_ead: number;
  total_ecl: number;
}

interface CustomerSegmentationCardProps {
  selectedDateInterval: string;
  filteredCustomerCategory?: {
    PRIVATE?: number;
    PUBLIC?: number;
    "GOVT OWNED PRIVATE"?: number;
  };
}

export const CustomerSegmentationCard: React.FC<
  CustomerSegmentationCardProps
> = ({ selectedDateInterval, filteredCustomerCategory }) => {
  const { data, isLoading } = useGet<ApiResponse<CustomerSegmentation[]>>(
    ["customerSegmentation", selectedDateInterval],
    `/reporting/models/dashboard?section=total_cust_per_loan_class_and_customer_category`,
    {
      enabled: !filteredCustomerCategory,
    },
  );
  const segmentationData = useMemo(() => {
    if (filteredCustomerCategory) {
      const privateSectorCustomers = filteredCustomerCategory.PRIVATE || 0;
      const publicSectorCustomers = filteredCustomerCategory.PUBLIC || 0;
      const governmentOwnedCustomers =
        filteredCustomerCategory["GOVT OWNED PRIVATE"] || 0;

      return {
        privateSectorCustomers,
        publicSectorCustomers,
        governmentOwnedCustomers,
      };
    }

    if (!data?.data || data?.data?.length === 0) {
      return {
        privateSectorCustomers: 0,
        publicSectorCustomers: 0,
        governmentOwnedCustomers: 0,
      };
    }

    let privateSectorCustomers = 0;
    let publicSectorCustomers = 0;
    let governmentOwnedCustomers = 0;

    data.data.forEach((item) => {
      const customerCount = item.total_customer;
      const category = item.CUSTOMER_CATEGORY.toLowerCase().trim();

      if (
        category.includes("govt owned") ||
        category.includes("government owned")
      ) {
        governmentOwnedCustomers += customerCount;
      } else if (category.includes("public")) {
        publicSectorCustomers += customerCount;
      } else {
        privateSectorCustomers += customerCount;
      }
    });

    return {
      privateSectorCustomers,
      publicSectorCustomers,
      governmentOwnedCustomers,
    };
  }, [data, filteredCustomerCategory]);

  const {
    privateSectorCustomers,
    publicSectorCustomers,
    governmentOwnedCustomers,
  } = segmentationData;

  const totalCustomers =
    privateSectorCustomers + publicSectorCustomers + governmentOwnedCustomers;

  const chartData =
    totalCustomers > 0
      ? [
          (privateSectorCustomers / totalCustomers) * 100,
          (publicSectorCustomers / totalCustomers) * 100,
          (governmentOwnedCustomers / totalCustomers) * 100,
        ]
      : [0, 0, 0];

  const legendItems = [
    {
      label: "Baseline",
      value: `0`,
      color: "#F79661",
    },
    {
      label: "Best Case",
      value: `0`,
      color: "#2B4DED",
    },
    {
      label: "Worst Case",
      value: `0`,
      color: "#2BEB81",
    },
  ];

  if (isLoading && !filteredCustomerCategory) {
    return <ChartCardSkeleton />;
  }

  return (
    <ChartDetailsCard
      title="Probability of Scenarios"
      chartData={chartData}
      labels={["Baseline", "Best Case", "Worst Case"]}
      colors={["#FDDD48", "#96D4AB", "#3B82F6"]}
      legendItems={legendItems}
    />
  );
};
