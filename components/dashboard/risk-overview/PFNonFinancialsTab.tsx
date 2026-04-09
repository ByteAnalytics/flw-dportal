"use client";

import { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useCaseDetails,
  usePFQuestions,
} from "@/hooks/use-risk-overview";
import {
  DynamicSection,
  DynamicField,
  getOptionValues,
} from "@/hooks/use-non-financials-form";
import { useState } from "react";
import NonFinancialsForm from "./NonFinancialsForm";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

export type PFNonFinancialsData = Record<string, string>;

function buildDynamicSections(
  data: Record<string, Record<string, Record<string, string[]>>> | undefined,
): DynamicSection[] {
  if (!data) return [];
  return Object.entries(data).map(([category, subsections]) => {
    const fields: DynamicField[] = [];
    Object.entries(subsections).forEach(([subsection, questions]) => {
      Object.entries(questions).forEach(([question, optionLabels]) => {
        fields.push({
          key: `${category}||${subsection}||${question}`,
          label: question,
          options: optionLabels.map((label) => ({ label, value: label })),
        });
      });
    });
    return { title: category.toUpperCase(), fields };
  });
}

interface PFNonFinancialsTabProps {
  onClose: () => void;
  onNext: (data: PFNonFinancialsData) => void;
  onSaveAsDraft: (data: PFNonFinancialsData) => void;
  onPrevious?: () => void;
}

export default function PFNonFinancialsTab({
  onClose,
  onNext,
  onSaveAsDraft,
  onPrevious,
}: PFNonFinancialsTabProps) {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const [initialValues, setInitialValues] = useState<PFNonFinancialsData>({});

  const { caseDetails, isLoadingCaseDetails } =
        useRiskOverviewStore();
  const { data: questionsData, isLoading: isLoadingQuestions } = usePFQuestions(
    caseId || undefined,
  );

  const sections = useMemo(
    () => buildDynamicSections(questionsData?.data),
    [questionsData],
  );

  // useEffect(() => {
  //   if (caseId) refetch();
  // }, [caseId, refetch]);

  useEffect(() => {
    if (
      !caseDetails?.pf_non_financials ||
      sections.length === 0 ||
      !questionsData?.data
    )
      return;

    const savedData = caseDetails?.pf_non_financials as Record<
      string,
      Record<string, Record<string, string>>
    >;
    const questionsRaw = questionsData.data as Record<
      string,
      Record<string, Record<string, string[]>>
    >;
    const populated: PFNonFinancialsData = {};

    Object.entries(savedData).forEach(([category, subsections]) => {
      Object.entries(subsections).forEach(([subsection, questionEntries]) => {
        const realQuestions = Object.keys(
          questionsRaw?.[category]?.[subsection] ?? {},
        );
        Object.entries(questionEntries).forEach(([savedKey, savedValue]) => {
          if (!savedValue) return;
          const match = savedKey.match(/^additionalProp(\d+)$/);
          const resolvedQuestion = match
            ? realQuestions[parseInt(match[1], 10) - 1]
            : savedKey;
          if (!resolvedQuestion) return;
          const optionLabels =
            questionsRaw?.[category]?.[subsection]?.[resolvedQuestion] ?? [];
          const scores = getOptionValues(optionLabels.length);
          const scoreIndex = scores.indexOf(String(savedValue));
          populated[`${category}||${subsection}||${resolvedQuestion}`] =
            scoreIndex !== -1 ? optionLabels[scoreIndex] : String(savedValue);
        });
      });
    });

    setInitialValues(populated);
  }, [caseDetails, sections, questionsData]);

  return (
    <NonFinancialsForm
      progressType="pf_non_financials"
      sections={sections}
      initialValues={initialValues}
      isLoadingQuestions={isLoadingQuestions}
      onNext={onNext}
      onSaveAsDraft={onSaveAsDraft}
      onPrevious={onPrevious}
    />
  );
}
