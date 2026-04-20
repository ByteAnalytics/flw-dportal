"use client";

import React from "react";
import { Users } from "lucide-react";
import { Team } from "@/types/teams";
import {
  TEAM_COLORS,
  TEAM_ICON_BG,
} from "@/constants/team-management-extended";

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  const colorConfig = TEAM_COLORS[team.name] ?? {
    text: "text-[#374151]",
    bg: "bg-[#F3F4F6]",
    dot: "bg-[#9CA3AF]",
  };
  const iconBg = TEAM_ICON_BG[team.name] ?? "bg-[#F3F4F6]";

  const visibleProcesses = team?.processes?.slice(0, 2) ?? [];
  const remainingCount = team?.processes?.length
    ? team?.processes?.length - 2
    : 0;

  return (
    <div
      className="bg-white rounded-[16px] border border-[#F3F4F6] p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-12 h-12 rounded-[12px] ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Users size={22} className={colorConfig.text} />
        </div>
        <h3 className="text-[17px] font-[700] text-[#111827]">{team.name}</h3>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-[#F3F4F6]">
        {[
          { value: team?.process_count ?? 0, label: "Processes" },
          { value: team?.member_count ?? 0, label: "Members" },
          { value: team?.api_connections_count ?? 0, label: "APIs" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-[22px] font-[700] text-[#111827] leading-none mb-1">
              {value}
            </p>
            <p className="text-[12px] text-[#9CA3AF] font-[500]">{label}</p>
          </div>
        ))}
      </div>

      {/* Processes list */}
      <div>
        {visibleProcesses.length > 0 && (
          <>
            <p className="text-[12px] font-[600] text-[#9CA3AF] mb-3">
              Processes
            </p>
            <div className="flex flex-wrap gap-2">
              {visibleProcesses?.map((p) => (
                <span
                  key={p?.id}
                  className="text-[12px] font-[500] text-[#374151] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1"
                >
                  {p?.process_name}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-[12px] font-[500] text-[#6B7280] bg-[#F3F4F6] rounded-full px-3 py-1">
                  +{remainingCount} more
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
