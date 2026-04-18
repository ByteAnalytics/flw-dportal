"use client";

import React from "react";
import Link from "next/link";
import { TeamSummary, EffortDistribution } from "@/types/dashboard";
import { TEAM_COLORS } from "@/constants/team-management-extended";

interface TeamsSidebarProps {
  teams?: TeamSummary[];
  effortDistribution?: EffortDistribution[];
  isLoading?: boolean;
}

const EFFORT_BAR_COLORS: Record<string, string> = {
  Low: "bg-[#22C55E]",
  Medium: "bg-[#EAB308]",
  High: "bg-[#EF4444]",
};

const TeamsSidebar: React.FC<TeamsSidebarProps> = ({
  teams,
  effortDistribution,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="max-w-[320px] w-full flex-shrink-0 space-y-4">
        <div className="bg-white rounded-[12px] border border-[#F3F4F6] p-4 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-[320px] w-full flex-shrink-0 space-y-4">
      {/* Teams list */}
      <div className="bg-white rounded-[12px] border border-[#F3F4F6] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-[700] text-[#111827]">Teams</h3>
          <Link
            href="/dashboard/team-management"
            className="text-[12px] font-[600] text-[#006F37] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {teams?.map((team) => {
            const colorConfig =
              TEAM_COLORS[team.name] ?? TEAM_COLORS["Chargeback"];
            return (
              <div
                key={team.id}
                className="flex items-center justify-between py-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colorConfig.dot}`} />
                  <span className="text-[13px] font-[500] text-[#374151]">
                    {team.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#9CA3AF]">
                    {team?.processes_count ?? 0} processes ·{" "}
                    {team?.members_count ?? 0} members
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Effort distribution */}
      {effortDistribution && effortDistribution.length > 0 && (
        <div className="bg-white rounded-[12px] border border-[#F3F4F6] p-4">
          <h3 className="text-[14px] font-[700] text-[#111827] mb-4">
            Effort Distribution
          </h3>
          <div className="space-y-3">
            {effortDistribution.map((item) => (
              <div key={item.level} className="flex items-center gap-3">
                <span className="text-[13px] font-[500] text-[#374151] w-16">
                  {item.level}
                </span>
                <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${EFFORT_BAR_COLORS[item.level]}`}
                    style={{
                      width: `${Math.min(100, (item.count / 10) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[12px] text-[#9CA3AF] w-8 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsSidebar;
