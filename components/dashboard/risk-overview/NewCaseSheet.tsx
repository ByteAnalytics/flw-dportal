"use client";

import React, { useEffect } from "react";
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
  PROJECT_TYPE,
  yesNoOptions,
} from "@/constants/risk-overview";
import { useSearchParams } from "next/navigation";
import { useCaseDetails, useUpdateProgress } from "@/hooks/use-risk-overview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface NewCaseSheetProps {
  onClose: () => void;
  onSuccess?: (facilityType: string, newCaseId: string) => void;
  onPrevious?: () => void;
  onSkip?: () => void;
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

const NewCaseSheet: React.FC<NewCaseSheetProps> = ({
  onClose,
  onSuccess,
  onPrevious,
  onSkip,
}) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const caseId = searchParams.get("caseId");

  const {
    data,
    isLoading: isLoadingCase,
    refetch,
  } = useCaseDetails(caseId || undefined);

  const caseData = data?.data;

  console.log("Case data in NewCaseSheet:", caseData);

  const form = useForm<NewCaseFormData>({
    resolver: zodResolver(NewCaseSchema),
    defaultValues: {
      select_project_type: "",
      customer_name: "",
      facility_type: "",
      revenue_growth: "no",
      counterparty_losses: "no",
      market_events: "",
      market_event_description: "",
      year_of_financials: "",
      dre_project: "",
    },
  });

  // Use a separate useEffect with a flag to prevent multiple resets
  useEffect(() => {
    if (!caseData) return;

    // Use setTimeout to ensure the form is ready
    const timeoutId = setTimeout(() => {
      const newValues = {
        select_project_type: caseData.project_type ?? "",
        customer_name: caseData.customer_name ?? "",
        facility_type: caseData.facility_type ?? "",
        revenue_growth:
          caseData.consistent_revenue_growth === true ? "yes" : "no",
        counterparty_losses:
          caseData.market_event_losses === true ? "yes" : "no",
        market_events: caseData.applicable_market_events ?? "",
        market_event_description: caseData.market_event_description ?? "",
        year_of_financials: caseData.year_of_financials
          ? String(caseData.year_of_financials)
          : "",
        dre_project: caseData.dre_project_selection
          ? (Object.keys(caseData.dre_project_selection).find(
              (key) => caseData.dre_project_selection![key] === "Yes",
            ) ?? "")
          : "",
      };

      // Reset with keepDefaultValues: false to force update
      form.reset(newValues, { keepDefaultValues: false });

      // Manually trigger a re-render of select components
      form.trigger();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [caseData, form]);

  const createNewCase = usePost<ApiResponse<Apidata>, NewCaseFormData>(
    "/crr/cases",
    ["crr-cases"],
  );

  const { updateProgress, isPending: isUpdating } = useUpdateProgress(
    "model_info" as any,
    caseId || "",
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    watch,
  } = form;

  const lossIsDrivenByMarketEvent = watch("counterparty_losses") === "yes";

  const isLoading =
    createNewCase.isPending || isUpdating || isSubmitting || isLoadingCase;

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
        manual_weights: "No",
        year_of_financials: Number(data.year_of_financials ?? 0),
      };

      if (caseId) {
        // Update existing case using updateProgress
        const success = await updateProgress(payload);
        if (success) {
          await queryClient.invalidateQueries({
            queryKey: ["crr-cases"],
            exact: false,
            refetchType: "all",
          });
          onSuccess?.(data.facility_type, caseId);
        }
      } else {
        // Create new case
        const response = await createNewCase.mutateAsync(payload);
        toast.success(extractSuccessMessage(response));
        await queryClient.invalidateQueries({
          queryKey: ["crr-cases"],
          exact: false,
          refetchType: "all",
        });
        const newCaseId = response?.data?.id;
        onSuccess?.(data.facility_type, newCaseId);
      }
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  const handleSkip = () => {
    onSkip?.();
  };

  if (isLoadingCase) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6 mb-6">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          <div className="h-full space-y-4 overflow-y-auto">
            <CustomInputField
              key={`project_type_${caseId || "new"}_${caseData?.project_type}`}
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
              key={`customer_name_${caseId || "new"}_${caseData?.customer_name}`}
              control={control}
              fieldType={FormFieldType.INPUT}
              name="customer_name"
              label="Customer Name"
              placeholder="e.g Bytes Analytics"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              disabled={isLoading}
            />

            <CustomInputField
              key={`facility_type_${caseId || "new"}_${caseData?.facility_type}`}
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
              key={`revenue_growth_${caseId || "new"}_${caseData?.consistent_revenue_growth}`}
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
              key={`counterparty_losses_${caseId || "new"}_${caseData?.market_event_losses}`}
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
                  key={`market_events_${caseId || "new"}_${caseData?.applicable_market_events}`}
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
                  key={`market_event_description_${caseId || "new"}_${caseData?.market_event_description}`}
                  control={control}
                  fieldType={FormFieldType.INPUT}
                  name="market_event_description"
                  label="Market Event Description"
                  placeholder="Describe the market event"
                  className="bg-InfraBorder rounded-[10px] h-[44px]"
                  disabled={isLoading}
                />

                <CustomInputField
                  key={`year_of_financials_${caseId || "new"}_${caseData?.year_of_financials}`}
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
              key={`dre_project_${caseId || "new"}_${caseData?.dre_project_selection ? JSON.stringify(caseData.dre_project_selection) : "empty"}`}
              control={control}
              fieldType={FormFieldType.SELECT}
              name="dre_project"
              label="Select DRE project"
              placeholder="select DRE project type"
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              options={dreProjectOptions}
              disabled={isLoading}
            />
          </div>

          <div className="pt-6 flex items-center gap-3 justify-between">
            <div className="flex gap-3">
              {onPrevious && (
                <CustomButton
                  type="button"
                  title="Previous"
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
                />
              )}
              {onSkip && caseId && (
                <CustomButton
                  type="button"
                  title="Skip"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
                />
              )}
            </div>
            <CustomButton
              type="submit"
              title={caseId ? "Update" : "Continue"}
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
