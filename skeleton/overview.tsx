"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5">
    <Skeleton className="h-4 w-24 mb-2" />
    <Skeleton className="h-8 w-32 mb-3" />
    <div className="pt-3 border-t border-gray-100">
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const ChartCardSkeleton = () => (
  <div className="bg-white rounded-[20px] p-6">
    <Skeleton className="h-6 w-40 mb-6" />
    <div className="flex flex-col sm:flex-row items-center sm:gap-10 gap-3 w-full">
      <Skeleton className="w-[250px] h-[250px] rounded-full" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="sm:bg-white p-0 bg-none rounded-[20px] sm:p-6">
    <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <Skeleton className="h-10 w-32 rounded-[12px]" />
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  </div>
);
