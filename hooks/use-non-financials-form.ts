import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  useUpdateProgress,
  useSaveDraft,
  useCaseDetails,
} from "@/hooks/use-risk-overview";
import { PFNonFinancialsData } from "@/components/dashboard/risk-overview/PFNonFinancialsTab";
export interface DynamicField {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

export interface DynamicSection {
  title: string;
  fields: DynamicField[];
}

export function getOptionValues(count: number): string[] {
  switch (count) {
    case 1:
      return ["100"];
    case 2:
      return ["100", "0"];
    case 3:
      return ["100", "50", "0"];
    case 4:
      return ["100", "75", "50", "0"];
    case 5:
      return ["100", "75", "50", "25", "0"];
    default:
      return Array.from({ length: count }, (_, i) =>
        String(Math.round(100 - (100 / (count - 1)) * i)),
      );
  }
}

interface UseNonFinancialsFormProps {
  progressType: "pf_non_financials" | "cf_non_financials";
  sections: DynamicSection[];
  onNext: (data: PFNonFinancialsData) => void;
  onSaveAsDraft: (data: PFNonFinancialsData) => void;
  initialValues?: PFNonFinancialsData;
}

export function useNonFinancialsForm({
  progressType,
  sections,
  onNext,
  onSaveAsDraft,
  initialValues,
}: UseNonFinancialsFormProps) {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [values, setValues] = useState<PFNonFinancialsData>(
    initialValues ?? {},
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const { updateProgress, isPending: isUpdating } = useUpdateProgress(
    progressType,
    caseId || "",
  );
  const { saveDraft, isPending: isSavingDraft } = useSaveDraft(
    progressType,
    caseId || "",
  );

  const allKeys = useMemo(
    () => sections.flatMap((s) => s.fields.map((f) => f.key)),
    [sections],
  );

  // Apply initial values when they arrive (from parent population logic)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValues(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    if (submitAttempted) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, submitAttempted]);

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    allKeys.forEach((key) => {
      if (!values[key]) newErrors[key] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    setSubmitAttempted(true);
    if (!validate()) {
      document
        .querySelector("[data-field-error='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const success = await updateProgress(values);
    if (success) onNext(values);
  };

  const handleSaveAsDraft = async () => {
    await saveDraft(values);
    onSaveAsDraft(values);
  };

  const unansweredCount = allKeys.filter((k) => !values[k]).length;

  return {
    values,
    errors,
    submitAttempted,
    isUpdating,
    isSavingDraft,
    unansweredCount,
    handleChange,
    handleNext,
    handleSaveAsDraft,
  };
}
