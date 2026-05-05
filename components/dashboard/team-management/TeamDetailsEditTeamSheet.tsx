/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import TeamSheet from "./TeamSheet";

interface EditTeamSheetProps {
  open: boolean;
  team: any;
  onClose: () => void;
}

const TeamDetailsEditTeamSheet: React.FC<EditTeamSheetProps> = ({
  open,
  team,
  onClose,
}) => {
  return (
    <SheetWrapper
      open={open}
      title="Edit Team"
      description="Update team name and description."
      setOpen={onClose}
    >
      <TeamSheet team={team} onClose={onClose} onSuccess={onClose} />
    </SheetWrapper>
  );
};

export default TeamDetailsEditTeamSheet;
