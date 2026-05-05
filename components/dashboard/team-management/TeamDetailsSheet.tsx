/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import { useTeamById } from "@/hooks/use-teams";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import TeamDetailsTabs from "./TeamDetailsTabs";
import TeamDetailsFooter from "./TeamDetailsFooter";
import TeamDetailsEditTeamSheet from "./TeamDetailsEditTeamSheet";
import { Process } from "@/types/processes";
import { UserWithTeams } from "@/types/teams";
import { useQueryClient } from "@tanstack/react-query";

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  last_login: string;
}

interface TeamDetailsSheetProps {
  teamId: string;
  open: boolean;
  onClose: () => void;
}

const TeamDetailsSheet: React.FC<TeamDetailsSheetProps> = ({
  teamId,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const { data, isLoading, refetch } = useTeamById(teamId);
  const team = data?.data;

  const processes: Process[] = (team as any)?.processes ?? [];
  const users: UserWithTeams[] = (team as any)?.users ?? [];

  const handleOnMemeberUpdate = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["teams"] });
  };
  return (
    <>
      <SheetWrapper
        open={open}
        setOpen={(val) => !val && onClose()}
        title={team?.name ?? "Team Details"}
        description={`${team?.process_count ?? 0} processes · ${team?.member_count ?? 0} members`}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col h-full">
            <TeamDetailsTabs
              processes={processes}
              members={users}
              teamId={teamId}
              onProcessUpdated={handleOnMemeberUpdate}
              onMemberUpdated={handleOnMemeberUpdate}
            />
            <TeamDetailsFooter
              onClose={onClose}
              onEdit={() => setIsEditSheetOpen(true)}
            />
          </div>
        )}
      </SheetWrapper>

      <TeamDetailsEditTeamSheet
        open={isEditSheetOpen}
        team={team}
        onClose={() => setIsEditSheetOpen(false)}
      />
    </>
  );
};

export default TeamDetailsSheet;
