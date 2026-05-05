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
import { ProcessFormSchema, ProcessFormData } from "@/schema/process";
import { useCreateProcess, useUpdateProcess } from "@/hooks/use-processes";
import { useTeams } from "@/hooks/use-teams";
import { Process } from "@/types/processes";
import {
  frequencyOptions,
  effortOptions,
} from "@/constants/process-management";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

interface ProcessSheetProps {
  process?: Process | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const ProcessSheet: React.FC<ProcessSheetProps> = ({
  process,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { data: teamsData } = useTeams();

  const teamOptions =
    teamsData?.data.map((t) => ({ label: t.name, value: t.id })) ?? [];

  const form = useForm<ProcessFormData>({
    resolver: zodResolver(ProcessFormSchema),
    defaultValues: {
      name: process?.process_name ?? "",
      team_id: process?.team_id ?? "",
      point_of_contact: process?.point_of_contact ?? "",
      frequency: process?.frequency ?? "Daily",
      effort: process?.effort ?? "Low",
      description: process?.description ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const createProcess = useCreateProcess();
  const updateProcess = useUpdateProcess(process?.id ?? "");

  const refreshProcesses = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["processes"],
      exact: false,
      refetchType: "all",
    });
  };

  const onSubmit = async (data: ProcessFormData) => {
    try {
      let response;
      if (process?.id) {
        response = await updateProcess.mutateAsync(data);
      } else {
        response = await createProcess.mutateAsync(data);
      }
      toast.success(extractSuccessMessage(response));
      await refreshProcesses();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const isLoading =
    createProcess.isPending || updateProcess.isPending || isSubmitting;

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
              label="Process Name"
              placeholder="e.g. Monthly Vendor Invoice Reconciliation"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="team_id"
              label="Team"
              placeholder="Select team"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              options={teamOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="point_of_contact"
              label="Point of Contact"
              placeholder="e.g. David Taiwo"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="frequency"
              label="Frequency"
              placeholder="Select frequency"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              options={frequencyOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="effort"
              label="Effort Level"
              placeholder="Select effort level"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              options={effortOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label="Description (optional)"
              placeholder="Brief description of what this process does"
              className="bg-InfraBorder rounded-[16px]"
              disabled={isLoading}
            />
          </div>

          <div className="pt-6">
            <CustomButton
              type="submit"
              title={process?.id ? "Save Changes" : "Create Process"}
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

export default ProcessSheet;
