"use client";

import React, { useState } from "react";
import TeamDetailsProcessesTab from "./TeamDetailsProcessesTab";
import TeamDetailsMembersTab from "./TeamDetailsMembersTab";

type Tab = "processes" | "members";

interface TeamTabsProps {
  processes: any[];
  members: any[];
  teamId: string;
  onProcessUpdated?: () => void;
  onMemberUpdated?: () => void;
}

const TeamDetailsTabs: React.FC<TeamTabsProps> = ({
  processes,
  members,
  teamId,
  onProcessUpdated,
  onMemberUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("processes");

  return (
    <>
      {/* Tab Headers */}
      <div className="flex border-b border-[#F3F4F6] mb-4 -mx-6 px-6">
        {(["processes", "members"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 mr-8 text-[14px] font-[600] capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#F59E0B] text-[#111827]"
                : "border-transparent text-[#9CA3AF] hover:text-[#374151]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "processes" && (
        <TeamDetailsProcessesTab
          processes={processes}
          teamId={teamId}
          onProcessUpdated={onProcessUpdated}
        />
      )}
      {activeTab === "members" && (
        <TeamDetailsMembersTab
          members={members}
          teamId={teamId}
          onMemberUpdated={onMemberUpdated}
        />
      )}
    </>
  );
};

export default TeamDetailsTabs;
