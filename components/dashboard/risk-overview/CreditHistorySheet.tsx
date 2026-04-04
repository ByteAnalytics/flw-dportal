"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import CustomInputField from "@/components/ui/custom-input-field";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType } from "@/types";
import {
  useSaveDraft,
  useUpdateProgress,
  useCaseDetails,
} from "@/hooks/use-risk-overview";
import { extractErrorMessage } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
const CREDIT_HISTORY_OPTIONS = [
  { label: "Not Applicable", value: "Not Applicable" },
  {
    label:
      "Restructured/rescheduled credit (not triggered by default event) within the last 1 year",
    value:
      "Restructured/rescheduled credit (not triggered by default event) within the last 1 year",
  },
  {
    label: "Payment defaults within the last 2 years",
    value: "Payment defaults within the last 2 years",
  },
  {
    label: "Payment defaults post restructuring",
    value: "Payment defaults post restructuring",
  },
];

const CreditHistorySchema = z.object({
  credit_history_adjustment: z.string().min(1, "Please select an option"),
});

type CreditHistoryFormData = z.infer<typeof CreditHistorySchema>;

interface CreditHistorySheetProps {
  onClose: () => void;
  onNext: (data: { credit_history_adjustment: string }) => void;
  onSaveAsDraft?: () => void;
  onPrevious?: () => void;
}

const CreditHistorySheet: React.FC<CreditHistorySheetProps> = ({
  onClose,
  onNext,
  onSaveAsDraft,
  onPrevious,
}) => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  // Fetch case data
  const { data: caseData, refetch } = useCaseDetails(caseId || undefined);

  const form = useForm<CreditHistoryFormData>({
    resolver: zodResolver(CreditHistorySchema),
    defaultValues: {
      credit_history_adjustment: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    getValues,
    reset,
  } = form;

  const { saveDraft, isPending: isSavingDraft } = useSaveDraft(
    "credit_history",
    caseId || undefined,
  );
  const { updateProgress, isPending: isUpdating } = useUpdateProgress(
    "credit_history",
    caseId || undefined,
  );

  const isLoading = isSavingDraft || isSubmitting || isUpdating;

  // Fetch case data on mount
  useEffect(() => {
    if (caseId) {
      refetch();
    }
  }, [caseId, refetch]);

  // Initialize form from fetched case data
  useEffect(() => {
    if (caseData?.data?.credit_history_adjustment) {
      const creditHistoryData = caseData.data.credit_history_adjustment;

      reset({
        credit_history_adjustment: creditHistoryData || "",
      });
    }
  }, [caseData, reset]);

  const onSubmit = async (data: CreditHistoryFormData) => {
    const success = await updateProgress(data);
    if (success) {
      onNext({ credit_history_adjustment: data.credit_history_adjustment });
    }
  };

  const handleSaveAsDraft = async () => {
    const values = getValues();
    if (!values.credit_history_adjustment) {
      toast.error("Please select an option before saving as draft");
      return;
    }

    try {
      const success = await saveDraft(values);
      if (success && onSaveAsDraft) {
        toast.success("Draft saved successfully");
        onSaveAsDraft();
      }
    } catch (error: any) {
      toast.error(extractErrorMessage(error) || "Failed to save draft");
    }
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  return (
    <div className="flex flex-col h-fit w-full">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col min-h-[82vh] justify-between"
        >
          <div className="flex-1 py-6">
            <p className="text-[13px] text-gray-500 mb-4">
              Select applicable credit history parameter
            </p>

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="credit_history_adjustment"
              label=""
              placeholder="Select an option"
              options={CREDIT_HISTORY_OPTIONS}
              className="bg-InfraBorder rounded-[10px] h-[44px]"
              disabled={isLoading}
            />
          </div>

          <div className="pt-6 flex items-center gap-3 justify-between mt-auto">
            {onPrevious &&  (
              <CustomButton
                type="button"
                title="Previous"
                onClick={handlePrevious}
                disabled={isSavingDraft || isUpdating}
                className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
              />
            )}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-6 ">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isLoading}
                className="bg-white border-InfraBorder h-[40px] text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingDraft ? "Saving..." : "Save as draft"}
              </button>

              <CustomButton
                type="submit"
                title="Next"
                isLoading={isUpdating}
                disabled={!isValid || isLoading}
                className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px]"
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreditHistorySheet;
