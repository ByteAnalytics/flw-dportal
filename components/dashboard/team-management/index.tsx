"use client";

import React, { useState } from "react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import CustomButton from "@/components/ui/custom-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useTeams } from "@/hooks/use-teams";
import TeamSheet from "./TeamSheet";
import TeamCard from "./TeamCard";
import TeamDetailsSheet from "./TeamDetailsSheet";

const Teams = () => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const { data, isLoading } = useTeams();
  const teams = data?.data ?? [];

  return (
    <div>
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-[1.5rem] font-[700] text-[#111827]">
            Team Management
          </h2>
          <p className="font-[500] text-sm text-[#6B7280] mt-1">
            Manage teams and their process assignments
          </p>
        </div>
        <SheetWrapper
          open={isAddSheetOpen}
          title="Add New Team"
          description="Create a new team to group processes and assign members."
          setOpen={setIsAddSheetOpen}
          trigger={
            <CustomButton
              onClick={() => setIsAddSheetOpen(true)}
              title="+ Add Team"
              textClassName="md:text-[13px] text-[12px] font-[700] text-white"
              className="ms-auto min-w-[130px] rounded-[12px] border md:h-[43px] h-[41px]"
            />
          }
        >
          <TeamSheet onClose={() => setIsAddSheetOpen(false)} />
        </SheetWrapper>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={() => setSelectedTeamId(team.id)}
            />
          ))}
        </div>
      )}

      {selectedTeamId && (
        <TeamDetailsSheet
          teamId={selectedTeamId}
          open={!!selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
    </div>
  );
};

export default Teams;
