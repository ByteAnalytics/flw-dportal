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
import {
  AddIntegrationSchema,
  AddIntegrationFormData,
} from "@/schema/settings";
import { useAddIntegration } from "@/hooks/use-settings";
import { useTeams } from "@/hooks/use-teams";
import { iconOptions } from "@/constants/settings";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

interface AddIntegrationSheetProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddIntegrationSheet: React.FC<AddIntegrationSheetProps> = ({
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { data: teamsData } = useTeams();

  const teamCheckboxOptions =
    teamsData?.data.map((t) => ({ label: t.name, value: t.id })) ?? [];

  const form = useForm<AddIntegrationFormData>({
    resolver: zodResolver(AddIntegrationSchema),
    defaultValues: {
      name: "",
      description: "",
      api_key: "",
      icon: "plug",
      team_ids: [],
      enable_immediately: true,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  const addIntegration = useAddIntegration();
  const enableImmediately = watch("enable_immediately");

  const refreshIntegrations = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["api-integrations"],
      exact: false,
      refetchType: "all",
    });
  };

  const onSubmit = async (data: AddIntegrationFormData) => {
    try {
      const response = await addIntegration.mutateAsync(data);
      toast.success(extractSuccessMessage(response));
      await refreshIntegrations();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const isLoading = addIntegration.isPending || isSubmitting;

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
              label="Integration Name"
              placeholder="e.g. PayStack API"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label="Description"
              placeholder="What does this integration do?"
              className="bg-InfraBorder rounded-[16px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="api_key"
              label="API Key / Connection String"
              placeholder="Enter API key or connection URL"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="icon"
              label="Icon"
              placeholder="Select icon"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              options={iconOptions}
              disabled={isLoading}
            />

            {/* Assign to Teams */}
            <div>
              <p className="text-[13px] font-[600] text-[#374151] mb-3">
                Assign to Teams
              </p>
              <div className="border border-[#E5E7EB] rounded-[16px] p-4 space-y-3 bg-InfraBorder">
                {teamCheckboxOptions.map((option) => (
                  <CustomInputField
                    key={option.value}
                    control={control}
                    fieldType={FormFieldType.CHECKBOX}
                    name="team_ids"
                    label={option.label}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Enable immediately toggle */}
            <div className="flex items-center justify-between p-4 bg-InfraBorder rounded-[16px] border border-[#E5E7EB]">
              <span className="text-[13px] font-[500] text-[#374151]">
                Enable immediately after creation
              </span>
              <button
                type="button"
                onClick={() =>
                  setValue("enable_immediately", !enableImmediately)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableImmediately ? "bg-[#F59E0B]" : "bg-[#D1D5DB]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableImmediately ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-6">
            <CustomButton
              type="submit"
              title="Add Integration"
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

export default AddIntegrationSheet;
