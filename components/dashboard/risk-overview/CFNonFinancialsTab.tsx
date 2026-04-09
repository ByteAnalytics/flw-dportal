"use client";

import { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCaseDetails, useCFQuestions } from "@/hooks/use-risk-overview";
import { DynamicSection, DynamicField } from "@/hooks/use-non-financials-form";
import { PFNonFinancialsData } from "./PFNonFinancialsTab";
import NonFinancialsForm from "./NonFinancialsForm";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

function buildDynamicSections(
  data: Record<string, Record<string, string[]>> | undefined,
): DynamicSection[] {
  if (!data) return [];
  return Object.entries(data).map(([category, questions]) => {
    const fields: DynamicField[] = [];
    Object.entries(questions).forEach(([question, optionLabels]) => {
      fields.push({
        key: `${category}||${question}`,
        label: question,
        options: optionLabels.map((label) => ({ label, value: label })),
      });
    });
    return { title: category.toUpperCase(), fields };
  });
}

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
  const [initialValues, setInitialValues] = useState<PFNonFinancialsData>({});

  const { caseDetails, isLoadingCaseDetails } =
      useRiskOverviewStore();
  const { data: questionsData, isLoading: isLoadingQuestions } = useCFQuestions(
    caseId || undefined,
  );

  const sections = useMemo(
    () => buildDynamicSections(questionsData?.data),
    [questionsData],
  );

  useEffect(() => {
    if (
      !caseDetails?.cf_non_financials ||
      sections.length === 0 ||
      !questionsData?.data
    )
      return;

    const savedData = caseDetails?.cf_non_financials?.[
      "Corporate Non-financial"
    ] as Record<string, Record<string, string>>;

    console.log("Saved CF Non-Financials Data:", savedData);
    const questionsRaw = questionsData.data as Record<
      string,
      Record<string, string[]>
    >;
    const populated: PFNonFinancialsData = {};

    Object.entries(savedData).forEach(([category, questionEntries]) => {
      Object.entries(questionEntries).forEach(([question, savedValue]) => {
        if (!savedValue) return;
        const optionLabels = questionsRaw?.[category]?.[question] ?? [];
        const resolvedLabel = optionLabels.includes(String(savedValue))
          ? String(savedValue)
          : String(savedValue);
        populated[`${category}||${question}`] = resolvedLabel;
      });
    });

    setInitialValues(populated);
  }, [caseDetails, sections, questionsData]);

  return (
    <NonFinancialsForm
      progressType="cf_non_financials"
      sections={sections}
      initialValues={initialValues}
      isLoadingQuestions={isLoadingQuestions}
      onNext={onNext}
      onSaveAsDraft={onSaveAsDraft}
      onPrevious={onPrevious}
    />
  );
}
