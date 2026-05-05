/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import CustomInputField from "@/components/ui/custom-input-field";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType } from "@/types";
import { useCreateTeam, useUpdateTeam } from "@/hooks/use-teams";
import { Team } from "@/types/teams";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { TeamFormData, TeamFormSchema } from "@/schema/teams";

interface TeamSheetProps {
  team?: Team | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const TeamSheet: React.FC<TeamSheetProps> = ({ team, onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<TeamFormData>({
    resolver: zodResolver(TeamFormSchema),
    defaultValues: {
      name: team?.name ?? "",
      description: team?.description ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam(team?.id ?? "");

  const refreshTeams = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["teams"],
      exact: false,
      refetchType: "all",
    });
  };

  const onSubmit = async (data: TeamFormData) => {
    try {
      let response;
      if (team?.id) {
        response = await updateTeam.mutateAsync(data);
      } else {
        response = await createTeam.mutateAsync(data);
      }
      toast.success(extractSuccessMessage(response));
      await refreshTeams();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const isLoading =
    createTeam.isPending || updateTeam.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-6 h-[85%] pb-6">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          <div className="h-full space-y-4 overflow-y-auto">
            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="name"
              label="Team Name"
              placeholder="e.g. Compliance"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />
            <CustomInputField
              control={control}
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label="Description"
              placeholder="Brief description of team responsibilities"
              className="bg-InfraBorder rounded-[16px]"
              disabled={isLoading}
            />
          </div>
          <div className="pt-6">
            <CustomButton
              type="submit"
              title={team?.id ? "Save Changes" : "Create Team"}
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full hover:bg-[#005a2d] text-white rounded-[8px]"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TeamSheet;
