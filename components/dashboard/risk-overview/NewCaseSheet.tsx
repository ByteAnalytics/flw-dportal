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
  pfWeights,
  PROJECT_TYPE,
  yesNoOptions,
} from "@/constants/risk-overview";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface NewCaseSheetProps {
  onClose: () => void;
  onSuccess?: (facilityType: string, newCaseId: string) => void;
}

interface Apidata {
  id: string;
  case_number: string;
  customer_name: string;
  facility_type: string;
  project_type: string;
  status: string;
  rater_name: string;
  validator_name: string;
  rating: string;
  last_updated: string;
  consistent_revenue_growth: boolean;
  market_event_losses: boolean;
  applicable_market_events: string;
  market_event_description: string;
  dre_project_selection: string[];
  manual_weights: boolean;
  pf_weight: number;
  cf_weight: number;
  year_of_financials: number;
  pf_financials: string;
  pf_non_financials: string;
  cf_financials: string;
  cf_non_financials: string;
  pf_results: string;
  cf_results: string;
  combined_results: string;
  validator_notes: string;
  submitted_at: string;
  reviewed_at: string;
  created_at: Date;
}

const NewCaseSheet: React.FC<NewCaseSheetProps> = ({ onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<NewCaseFormData>({
    resolver: zodResolver(NewCaseSchema),
    defaultValues: {
      select_project_type: "",
      customer_name: "",
      facility_type: "",
      revenue_growth: "",
      counterparty_losses: "yes",
      market_events: "",
      dre_project: "",
      manual_weightages: "yes",
      pf_weight: "",
      cf_weight: "",
      market_event_description: "",
      year_of_financials: "",
    },
  });

  const createNewCase = usePost<ApiResponse<Apidata>, NewCaseFormData>(
    "/crr/cases",
    ["crr-cases"],
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const lossIsDrivenByMarketEvent = form.watch("counterparty_losses") === "yes";

  const manuallyInputWeightages = form.watch("manual_weightages") === "yes";

  const isLoading = createNewCase.isPending || isSubmitting;

  const onSubmit = async (data: NewCaseFormData) => {
    try {
      const payload: any = {
        customer_name: data.customer_name,
        facility_type: data.facility_type,
        project_type: data.select_project_type === "yes" ? "DRE" : "Others",
        consistent_revenue_growth: data.revenue_growth === "yes" ? "Yes" : "No",
        market_event_losses: data.counterparty_losses === "yes" ? "Yes" : "No",
        ...(data.counterparty_losses === "yes" && {
          applicable_market_events: data.market_events,
          market_event_description: data.market_event_description ?? "",
        }),
        dre_project_selection: data.dre_project
          ? { [data.dre_project]: "Yes" }
          : {},
        manual_weights: data.manual_weightages === "yes" ? "Yes" : "No",
        ...(data.manual_weightages === "yes" && {
          pf_weight: Number(data.pf_weight),
          cf_weight: Number(data.cf_weight),
        }),
        year_of_financials: Number(data.year_of_financials ?? 0),
      };

      const response = await createNewCase.mutateAsync(payload);

      toast.success(extractSuccessMessage(response));
      await queryClient.invalidateQueries({
        queryKey: ["crr-cases"],
        exact: false,
        refetchType: "all",
      });
      const caseId = response?.data?.id;
      onSuccess?.(data.facility_type, caseId);
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
              name="select_project_type"
              label="Select Project Type"
              placeholder="Select project Type"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={PROJECT_TYPE}
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

            {lossIsDrivenByMarketEvent && (
              <>
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
                  fieldType={FormFieldType.INPUT}
                  name="market_event_description"
                  label="Market Event Description"
                  placeholder="Describe the market event"
                  className="bg-InfraBorder rounded-[10px] h-[44px]"
                  disabled={isLoading}
                />

                <CustomInputField
                  control={control}
                  fieldType={FormFieldType.INPUT}
                  name="year_of_financials"
                  label="Year of Financials"
                  placeholder="e.g. 2023"
                  className="bg-InfraBorder rounded-[10px] h-[44px]"
                  disabled={isLoading}
                />
              </>
            )}

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
            {manuallyInputWeightages && (
              <div className="grid grid-cols-2 gap-3">
                <CustomInputField
                  control={control}
                  fieldType={FormFieldType.SELECT}
                  options={pfWeights}
                  name="pf_weight"
                  label="PF Weight"
                  placeholder="enter weight"
                  className="bg-InfraBorder rounded-[10px] h-[44px]"
                  disabled={isLoading}
                />

                <CustomInputField
                  control={control}
                  fieldType={FormFieldType.SELECT}
                  options={pfWeights}
                  name="cf_weight"
                  label="CF Weight"
                  placeholder="enter weight"
                  className="bg-InfraBorder rounded-[10px] h-[44px]"
                  disabled={isLoading}
                />
              </div>
            )}
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
