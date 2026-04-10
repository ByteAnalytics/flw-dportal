"use client";

import React, { useEffect } from "react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import NewCaseSheet from "./NewCaseSheet";
import CFFinancialsSheet from "./CFFinancialsSheet";
import PFReportsSheet from "./PFReportSheets";
import CombinedReportsSheet from "./CFReportsSheet";
import CFNonFinancialsTab from "./CFNonFinancialsTab";
import PFFinancialsSheet from "./PFFinancialsSheet";
import PFNonFinancialsTab, { PFNonFinancialsData } from "./PFNonFinancialsTab";
import {
  useRiskOverviewStore,
  PFCompleteData,
} from "@/stores/risk-overview-store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CFFinancialsData } from "@/types/risk-overview";
import { VALID_STEPS, SHEET_CONFIG, Step } from "@/constants/risk-overview";
import CreditHistorySheet from "./CreditHistorySheet";
import { useCaseDetails } from "@/hooks/use-risk-overview";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  open: boolean;
  onClose: () => void;
}

const CaseSheetFlow: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    currentStep,
    caseId,
    projectPath,
    setCurrentStep,
    setCaseId,
    setProjectPath,
    setPFFinancialsData,
    setPFNonFinancialsData,
    setCFFinancialsData,
    setCFNonFinancialsData,
    setCaseDetails,
    setIsLoadingCaseDetails,
    resetAll,
  } = useRiskOverviewStore();

  const { data: caseData, isLoading: isLoadingCase } = useCaseDetails(
    caseId || undefined,
  );

  useEffect(() => {
    setIsLoadingCaseDetails(isLoadingCase);
  }, [isLoadingCase, setIsLoadingCaseDetails]);

  useEffect(() => {
    setCaseDetails(caseData?.data ?? null);
  }, [caseData, setCaseDetails]);
  
  const updateUrl = (nextStep: Step, id?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", nextStep);
    if (id) {
      params.set("caseId", id);
    } else {
      params.delete("caseId");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!open) return;

    const urlStep = searchParams.get("step") as Step;
    const urlCaseId = searchParams.get("caseId");
    const urlFacilityType = searchParams.get("facilityType");

    if (urlStep && VALID_STEPS.includes(urlStep)) setCurrentStep(urlStep);
    if (urlCaseId) setCaseId(urlCaseId);
    if (urlFacilityType) {
      setProjectPath(
        urlFacilityType === "Combined (PF & CF)"
          ? "Combined (PF & CF)"
          : "Pure PF",
      );
    }
  }, [open, searchParams, setCurrentStep, setCaseId, setProjectPath]);

  const goTo = (next: Step, id?: string | null) => {
    setCurrentStep(next);
    updateUrl(next, id ?? caseId);
  };

  const getPreviousStep = (): Step | null => {
    const stepFlow: Record<Step, Step | null> = {
      model_info: null,
      pf_financials: "model_info",
      pf_non_financials: "pf_financials",
      cf_financials: "pf_non_financials",
      cf_non_financials: "cf_financials",
      credit_history:
        projectPath === "Combined (PF & CF)"
          ? "cf_non_financials"
          : "pf_non_financials",
      pf_reports: "credit_history",
      combined_reports: "credit_history",
    };
    return stepFlow[currentStep] || null;
  };

  const getNextStep = (): Step | null => {
    const stepFlow: Record<Step, Step | null> = {
      model_info: "pf_financials",
      pf_financials: "pf_non_financials",
      pf_non_financials:
        projectPath === "Combined (PF & CF)"
          ? "cf_financials"
          : "credit_history",
      cf_financials: "cf_non_financials",
      cf_non_financials: "credit_history",
      credit_history:
        projectPath === "Combined (PF & CF)"
          ? "combined_reports"
          : "pf_reports",
      pf_reports: null,
      combined_reports: null,
    };
    return stepFlow[currentStep] || null;
  };

  const handlePrevious = () => {
    const prevStep = getPreviousStep();
    if (prevStep) goTo(prevStep);
  };

  const handleSkip = () => {
    const nextStep = getNextStep();
    if (nextStep && nextStep !== currentStep) goTo(nextStep);
  };

  const handleClose = () => {
    router.replace(pathname, { scroll: false });
    onClose();
    setTimeout(() => resetAll(), 200);
  };

  const showPrevious = getPreviousStep() !== null;
  const showSkip = getNextStep() !== null;

  const handlers = {
    modelInfo: (facilityType?: string, newCaseId?: string) => {
      if (newCaseId) setCaseId(newCaseId);
      setProjectPath(
        facilityType === "Combined (PF & CF)"
          ? "Combined (PF & CF)"
          : "Pure PF",
      );
      setTimeout(() => goTo("pf_financials", newCaseId), 50);
    },

    pfFinancials: (data: PFCompleteData) => {
      setPFFinancialsData(data);
      goTo("pf_non_financials");
    },

    pfNonFinancials: (data: PFNonFinancialsData) => {
      setPFNonFinancialsData(data);
      goTo(
        projectPath === "Combined (PF & CF)"
          ? "cf_financials"
          : "credit_history",
      );
    },

    cfFinancials: (data: CFFinancialsData) => {
      setCFFinancialsData(data);
      goTo("cf_non_financials");
    },

    cfNonFinancials: (data: any) => {
      setCFNonFinancialsData(data);
      goTo("credit_history");
    },

    creditHistory: (_data: { credit_history_adjustment: string }) => {
      goTo(
        projectPath === "Combined (PF & CF)"
          ? "combined_reports"
          : "pf_reports",
      );
    },

    submit: handleClose,
  };

  const renderContent = () => {
    switch (currentStep) {
      case "model_info":
        return (
          <NewCaseSheet
            onClose={handleClose}
            onSuccess={handlers.modelInfo}
            onSkip={showSkip ? handleSkip : undefined}
          />
        );
      case "pf_financials":
        return (
          <PFFinancialsSheet
            onClose={handleClose}
            onNext={handlers.pfFinancials}
            onSaveAsDraft={() => {}}
            onPrevious={showPrevious ? handlePrevious : undefined}
          />
        );
      case "pf_non_financials":
        return (
          <PFNonFinancialsTab
            onClose={handleClose}
            onNext={handlers.pfNonFinancials}
            onSaveAsDraft={() => {}}
            onPrevious={showPrevious ? handlePrevious : undefined}
          />
        );
      case "pf_reports":
        return (
          <PFReportsSheet
            onClose={handleClose}
            onSubmitForValidation={handlers.submit}
            onSaveAsDraft={() => {}}
            onPrevious={showPrevious ? handlePrevious : undefined}
          />
        );
      case "cf_financials":
        return (
          <CFFinancialsSheet
            onClose={handleClose}
            onNext={handlers.cfFinancials}
            onSaveAsDraft={() => {}}
            onPrevious={showPrevious ? handlePrevious : undefined}
          />
        );
      case "cf_non_financials":
        return (
          <CFNonFinancialsTab
            onClose={handleClose}
            onNext={handlers.cfNonFinancials}
            onSaveAsDraft={() => {}}
            onPrevious={showPrevious ? handlePrevious : undefined}
          />
        );
      case "credit_history":
        return (
          <CreditHistorySheet
            onClose={handleClose}
            onNext={handlers.creditHistory}
            onSaveAsDraft={() => {}}
            onPrevious={showPrevious ? handlePrevious : undefined}
          />
        );
      case "combined_reports":
        return (
          <CombinedReportsSheet
            onClose={handleClose}
            onSubmitForValidation={handlers.submit}
            onSaveAsDraft={() => {}}
            onPrevious={showPrevious ? handlePrevious : undefined}
          />
        );
      default:
        return null;
    }
  };

  const config = SHEET_CONFIG[currentStep];

  return (
    <SheetWrapper
      title={config.title}
      width={config.width}
      open={open}
      setOpen={(val) => !val && handleClose()}
      headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
      titleClassName="text-white px-6 py-4"
      SheetContentClassName="p-0"
    >
      <div className="md:px-6 px-4 h-full">{renderContent()}</div>
    </SheetWrapper>
  );
};

export default CaseSheetFlow;
