"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import CustomInputField from "@/components/ui/custom-input-field";
import CustomButton from "@/components/ui/custom-button";
import { usePost } from "@/hooks/use-queries";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { FormFieldType, ApiResponse } from "@/types";
import { NewCaseFormData, NewCaseSchema } from "@/schema/risk-overview";
import {
  dreProjectOptions,
  facilityTypeOptions,
  marketEventOptions,
  projectTypeOptions,
  yesNoOptions,
} from "@/constants/risk-overview";
import { Button } from "@/components/ui/button";

interface NewCaseSheetProps {
  onClose: () => void;
  onSuccess?: (dreProject?: string) => void;
}

const NewCaseSheet: React.FC<NewCaseSheetProps> = ({ onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<NewCaseFormData>({
    resolver: zodResolver(NewCaseSchema),
    defaultValues: {
      project_type: "",
      customer_name: "",
      facility_type: "",
      revenue_growth: "",
      counterparty_losses: "",
      market_events: "",
      dre_project: "",
      manual_weightages: "",
      pf_weight: "",
      cf_weight: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const createCase = usePost<ApiResponse<null>, NewCaseFormData>("/cases/", [
    "recent-cases",
  ]);

  const isLoading = createCase.isPending || isSubmitting;

  const onSubmit = async (data: NewCaseFormData) => {
    try {
      // const response = await createCase.mutateAsync(data);
      // toast.success(extractSuccessMessage(response));
      // await queryClient.invalidateQueries({
      //   queryKey: ["recent-cases"],
      //   exact: false,
      //   refetchType: "all",
      // });
      onSuccess?.("dre_a");
      // onClose();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-6">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          <div className="h-full space-y-4 overflow-y-auto">
            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="project_type"
              label="Select project type"
              placeholder="select project sector"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={projectTypeOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="customer_name"
              label="Customer Name"
              placeholder="e.g Bytes Analytics"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="facility_type"
              label="Facility Type"
              placeholder="select facility type"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={facilityTypeOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="revenue_growth"
              label="Has customer shown consistent revenue growth in the last 3 years?"
              placeholder="select answer"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={yesNoOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="counterparty_losses"
              label="Has the counterparty suffered losses driven by market events/force majeure?"
              placeholder="select answer"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={yesNoOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="market_events"
              label="Select applicable market events/force majeure"
              placeholder="select market event/force majeure"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={marketEventOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="dre_project"
              label="Select DRE project"
              placeholder="select DRE project type"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={dreProjectOptions}
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="manual_weightages"
              label="Do you want to manually input weightages for PF and Corporate"
              placeholder="select DRE project type"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={yesNoOptions}
              disabled={isLoading}
            />

            {/* PF Weight + CF Weight — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <CustomInputField
                control={control}
                fieldType={FormFieldType.INPUT}
                name="pf_weight"
                label="PF Weight"
                placeholder="enter weight"
                className="bg-InfraBorder rounded-[10px] h-[44px]"
                disabled={isLoading}
              />

              <CustomInputField
                control={control}
                fieldType={FormFieldType.INPUT}
                name="cf_weight"
                label="CF Weight"
                placeholder="enter weight"
                className="bg-InfraBorder rounded-[10px] h-[44px]"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end items-center">
            <CustomButton
              type="submit"
              title="Continue"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-[117px] h-[40px] flex items-center gap-2 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:bg-teal-700 text-white text-[16px] font-semibold"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewCaseSheet;
