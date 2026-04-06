"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { CF_NON_FINANCIALS_SECTIONS } from "@/constants/risk-cases";
import { Button } from "@/components/ui/button";
import { PFNonFinancialsData } from "./PFNonFinancialsTab";
import { useSearchParams } from "next/navigation";
import {
  useUpdateProgress,
  useSaveDraft,
  useCaseDetails,
} from "@/hooks/use-risk-overview";
import { convertCFNonFinancialsFromApiFormat } from "@/lib/risk-overview-utils";
import CustomButton from "@/components/ui/custom-button";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

interface CFNonFinancialsTabProps {
  onClose: () => void;
  onNext: (data: PFNonFinancialsData) => void;
  onSaveAsDraft: (data: PFNonFinancialsData) => void;
  onPrevious?: () => void;
}

export default function CFNonFinancialsTab({
  onClose,
  onNext,
  onSaveAsDraft,
  onPrevious,
}: CFNonFinancialsTabProps) {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const [values, setValues] = useState<PFNonFinancialsData>({});

  const { data: caseData, refetch } = useCaseDetails(caseId || undefined);

  const { updateProgress, isPending: isUpdating } = useUpdateProgress(
    "cf_non_financials",
    caseId || '',
  );
  const { saveDraft, isPending: isSavingDraft } = useSaveDraft(
    "cf_non_financials",
    caseId || '',
  );

  // Fetch case data on mount
  useEffect(() => {
    if (caseId) {
      refetch();
    }
  }, [caseId, refetch]);

  // Initialize form from fetched case data
  useEffect(() => {
    if (caseData?.data?.cf_non_financials) {
      const flatData = convertCFNonFinancialsFromApiFormat(
        caseData.data.cf_non_financials,
      );
      setValues(flatData);
    }
  }, [caseData]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    const success = await updateProgress(values);

    if (success) {
      onNext(values);
    }
  };

  const handleSaveAsDraft = async () => {
    await saveDraft(values);
    onSaveAsDraft(values);
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  return (
    <div className="flex flex-col gap-8 pb-6">
      {CF_NON_FINANCIALS_SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-[14px] font-bold text-InfraSoftBlack tracking-wide mb-4">
            {section.title}
          </h3>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-5">
            {section.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-[14px] font-[500] text-InfraSoftBlack">
                  {field.label}
                </label>
                <Select
                  value={values[field.key] ?? ""}
                  onValueChange={(val) => handleChange(field.key, val)}
                >
                  <SelectTrigger className="h-[45px] italic rounded-[10px] w-full border border-[#e5e5e5] bg-InfraBorder text-[#A3A3A3] text-[12px]">
                    <SelectValue placeholder="select answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-6 flex flex-wrap items-center gap-3 justify-between mt-auto">
        {onPrevious && (
          <CustomButton
            type="button"
            title="Previous"
            onClick={handlePrevious}
            disabled={isSavingDraft || isUpdating}
            className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
          />
        )}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            disabled={isSavingDraft}
            className="text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 bg-white cursor-pointer rounded-[8px] h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingDraft ? "Saving..." : "Save as draft"}
          </button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isUpdating}
            className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
