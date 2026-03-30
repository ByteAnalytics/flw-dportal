"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import CustomInputField from "@/components/ui/custom-input-field";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType } from "@/types";
import { useSaveDraft } from "@/hooks/use-risk-overview";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

const CREDIT_HISTORY_OPTIONS = [
  { label: "Not Applicable", value: "Not Applicable" },
  {
    label:
      "Restructured / Rescheduled credit (Not triggered by a default event) within the last 1 year",
    value:
      "Restructured / Rescheduled credit (Not triggered by a default event) within the last 1 year",
  },
  {
    label: "Payment defaults within the last 2 years",
    value: "Payment defaults within the last 2 years",
  },
  {
    label: "Payment defaults post-restructuring",
    value: "Payment defaults post-restructuring",
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
}

const CreditHistorySheet: React.FC<CreditHistorySheetProps> = ({
  onClose,
  onNext,
  onSaveAsDraft,
}) => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

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
  } = form;

  const { saveDraft, isPending: isSavingDraft } = useSaveDraft(
    "credit_history",
    caseId || undefined,
  );

  const isLoading = isSavingDraft || isSubmitting;

  const onSubmit = (data: CreditHistoryFormData) => {
    onNext({ credit_history_adjustment: data.credit_history_adjustment });
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

  return (
    <div className="flex flex-col min-h-[82vh] w-full">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
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

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-6">
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
              isLoading={isLoading}
              disabled={!isValid || isLoading}
              className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px]"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreditHistorySheet;
