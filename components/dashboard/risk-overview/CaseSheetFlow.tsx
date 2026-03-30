/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
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
import {
  VALID_STEPS,
  SHEET_CONFIG,
  Step,
} from "@/constants/risk-overview-constants";
import {
  MOCK_COMBINED_REPORT,
  MOCK_PF_REPORT,
} from "@/constants/risk-overview";
import CreditHistorySheet from "./CreditHistorySheet";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CaseSheetFlow: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Zustand store
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
    resetAll,
  } = useRiskOverviewStore();

  /* ================= URL SYNC ================= */

  const updateUrl = (nextStep: Step, id?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", nextStep);
    id ? params.set("caseId", id) : params.delete("caseId");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /* Restore state from URL */
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

  const handleClose = () => {
    router.replace(pathname, { scroll: false });
    onClose();

    setTimeout(() => {
      resetAll();
    }, 200);
  };

  const handlers = {
    modelInfo: (facilityType?: string, newCaseId?: string) => {
      if (newCaseId) setCaseId(newCaseId);

      const isCombined = facilityType === "Combined (PF & CF)";
      setProjectPath(isCombined ? "Combined (PF & CF)" : "Pure PF");

      setTimeout(() => {
        goTo("pf_financials", newCaseId);
      }, 50);
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

    creditHistory: (data: { credit_history_adjustment: string }) => {
      goTo(
        projectPath === "Combined (PF & CF)"
          ? "combined_reports"
          : "pf_reports",
      );
    },

    submit: handleClose,
  };

  const content = useMemo(() => {
    switch (currentStep) {
      case "model_info":
        return (
          <NewCaseSheet onClose={handleClose} onSuccess={handlers.modelInfo} />
        );

      case "pf_financials":
        return (
          <PFFinancialsSheet
            onClose={handleClose}
            onNext={handlers.pfFinancials}
            onSaveAsDraft={() => {}}
          />
        );

      case "pf_non_financials":
        return (
          <PFNonFinancialsTab
            onClose={handleClose}
            onNext={handlers.pfNonFinancials}
            onSaveAsDraft={() => {}}
          />
        );

      case "pf_reports":
        return (
          <PFReportsSheet
            onClose={handleClose}
            reportData={MOCK_PF_REPORT}
            onSubmitForValidation={handlers.submit}
            onSaveAsDraft={() => {}}
          />
        );

      case "cf_financials":
        return (
          <CFFinancialsSheet
            onClose={handleClose}
            onNext={handlers.cfFinancials}
            onSaveAsDraft={() => {}}
          />
        );

      case "cf_non_financials":
        return (
          <CFNonFinancialsTab
            onClose={handleClose}
            onNext={handlers.cfNonFinancials}
            onSaveAsDraft={() => {}}
          />
        );

      case "credit_history":
        return (
          <CreditHistorySheet
            onClose={handleClose}
            onNext={handlers.creditHistory}
            onSaveAsDraft={() => {}}
          />
        );

      case "combined_reports":
        return (
          <CombinedReportsSheet
            onClose={handleClose}
            reportData={MOCK_COMBINED_REPORT}
            onSubmitForValidation={handlers.submit}
            onSaveAsDraft={() => {}}
          />
        );

      default:
        return null;
    }
  }, [currentStep, projectPath]);

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
      <div className="px-6">{content}</div>
    </SheetWrapper>
  );
};

export default CaseSheetFlow;
