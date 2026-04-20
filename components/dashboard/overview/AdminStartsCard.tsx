"use client";

import React from "react";
import { DashboardStats } from "@/types/dashboard";

interface StatCard {
  label: string;
  value: number;
  subLabel: string;
}

interface StatsCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

const StatCardSkeleton = () => (
  <div className="bg-white rounded-[12px] border border-[#F3F4F6] p-6 animate-pulse">
    <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
    <div className="h-8 w-12 bg-gray-300 rounded mb-2" />
    <div className="h-3 w-20 bg-gray-200 rounded" />
  </div>
);

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards: StatCard[] = [
    {
      label: "TOTAL PROCESSES",
      value: stats?.total_processes ?? 0,
      subLabel: `${stats?.active_processes ?? 0} active`,
    },
    {
      label: "TEAMS",
      value: stats?.teams_count ?? 0,
      subLabel: "across operations",
    },
    {
      label: "USERS",
      value: stats?.users_count ?? 0,
      subLabel: `${stats?.active_users ?? 0} active`,
    },
    {
      label: "API INTEGRATIONS",
      value: stats?.api_integrations_count ?? 0,
      subLabel: `${stats?.connected_integrations ?? 0} connected`,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-[12px] border border-[#F3F4F6] p-6"
        >
          <p className="text-[11px] font-[600] text-[#6B7280] mb-2 tracking-wide">
            {card.label}
          </p>
          <p className="text-[2rem] font-[700] text-[#111827] leading-none mb-1">
            {card.value}
          </p>
          <p className="text-[13px] text-[#9CA3AF] font-[500]">
            {card.subLabel}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
