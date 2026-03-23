"use client";

import React, { useState } from "react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import NewCaseSheet from "./NewCaseSheet";
import PFFinancialsSheet, { PFFinancialsData } from "./PFFinancialsSheet";
import CFFinancialsSheet from "./CFFinancialsSheet";
import PFReportsSheet, { ReportSummaryData } from "./PFReportSheets";
import { CFFinancialsData } from "@/types/risk-overview";
import PFNonFinancialsTab, { PFNonFinancialsData } from "./PFNonFinancialsTab";
import CombinedReportsSheet, { CombinedReportData } from "./CFReportsSheet";
import CFNonFinancialsTab from "./CFNonFinancialsTab";
import ValidationReviewSheet from "./ValidationReviewSheet";
import { facilityTypeOptions } from "@/constants/risk-overview";

type Step =
  | "model_info"
  | "pf_financials"
  | "pf_non_financials"
  | "pf_reports"
  | "cf_financials"
  | "cf_non_financials"
  | "cf_scoring"
  | "combined_reports"
  | "validation_review";

type ProjectPath = "Pure PF" | "Combined (PF and Corporate)"

interface CaseSheetFlowProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_PF_REPORT: ReportSummaryData = {
  customer: "Abuja Steel Roll",
  projectType: "DRE Project",
  yearOfFinancials: "09 Mar 1900",
  financialRisk: 24.5,
  operationalRisk: 24.5,
  structureRisk: 24.5,
  pfScore: "76%",
  probabilityOfDefault: 1.96,
  baselineCreditScore: "AA-",
  finalCreditScore: "BBB+",
};

const MOCK_COMBINED_REPORT: CombinedReportData = {
  customer: "Abuja Steel Roll",
  projectType: "DRE Project",
  yearOfFinancials: "09 Mar 1900",
  pf: {
    financialRisk: 24.5,
    operationalRisk: 24.5,
    structureRisk: 24.5,
    pfScore: 24.5,
  },
  cf: {
    financialRisk: 24.5,
    operationalRisk: 24.5,
    structureRisk: 24.5,
    cfScore: 24.5,
  },
  initialPFScore: "76%",
  initialCFScore: "76%",
  probabilityOfDefault: 1.96,
  baselineCreditScore: "AA-",
  finalCreditScore: "BBB+",
};

const SHEET_WIDTH: Record<Step, string> = {
  model_info: "sm:max-w-[500px]",
  pf_financials: "sm:max-w-full",
  pf_non_financials: "sm:max-w-full",
  pf_reports: "sm:max-w-full",
  cf_financials: "sm:max-w-full",
  cf_non_financials: "sm:max-w-full",
  cf_scoring: "sm:max-w-full",
  combined_reports: "sm:max-w-full",
  validation_review: "sm:max-w-full",
};

const SHEET_TITLE: Record<Step, string> = {
  model_info: "Model Information",
  pf_financials: "PF Financials",
  pf_non_financials: "PF Non Financials",
  pf_reports: "PF Reports",
  cf_financials: "CF Financials",
  cf_non_financials: "CF Non Financials",
  cf_scoring: "CF Scoring Sheet",
  combined_reports: "Combined Reports",
  validation_review: "Validation Review",
};

const CaseSheetFlow: React.FC<CaseSheetFlowProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<Step>("model_info");
  const [path, setPath] = useState<ProjectPath>("Pure PF");

  const [pfFinancialsData, setPFFinancialsData] =
    useState<PFFinancialsData | null>(null);
  const [pfNonFinancialsData, setPFNonFinancialsData] =
    useState<PFNonFinancialsData | null>(null);
  const [cfFinancialsData, setCFFinancialsData] =
    useState<CFFinancialsData | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("model_info"), 300);
  };

  const handleModelInfoSuccess = (facilityType?: string) => {
    if (facilityType === "Combined (PF and Corporate)") {
      setPath("Combined (PF and Corporate)");
    } else {
      setPath("Pure PF");
    }
    setStep("pf_financials");
  };

  const handlePFFinancialsNext = (data: PFFinancialsData) => {
    setPFFinancialsData(data);
    setStep("pf_non_financials");
  };

  const handlePFNonFinancialsNext = (data: PFNonFinancialsData) => {
    setPFNonFinancialsData(data);
    if (path === "Combined (PF and Corporate)") {
      setStep("cf_financials");
    } else {
      setStep("pf_reports");
    }
  };

  const handleCFFinancialsNext = (data: CFFinancialsData) => {
    setCFFinancialsData(data);
    setStep("cf_non_financials");
  };

  const handleCFNonFinancialsNext = (data: PFNonFinancialsData) => {
    setStep("combined_reports");
  };

  const handleSubmitForValidation = () => {
     handleClose();
  };

  // const handleApproveRating = () => {
  //   setStep("cf_scoring");
  // };

  const renderContent = () => {
    switch (step) {
      case "model_info":
        return (
          <NewCaseSheet
            onClose={handleClose}
            onSuccess={(projectType) => handleModelInfoSuccess(projectType)}
          />
        );

      case "pf_financials":
        return (
          <PFFinancialsSheet
            onClose={handleClose}
            onNext={handlePFFinancialsNext}
            onSaveAsDraft={() => {}}
          />
        );

      case "pf_non_financials":
        return (
          <PFNonFinancialsTab
            onClose={handleClose}
            onNext={handlePFNonFinancialsNext}
            onSaveAsDraft={() => {}}
          />
        );

      case "pf_reports":
        return (
          <PFReportsSheet
            onClose={handleClose}
            reportData={MOCK_PF_REPORT}
            onSubmitForValidation={handleSubmitForValidation}
            onSaveAsDraft={() => {}}
          />
        );

      case "cf_financials":
        return (
          <CFFinancialsSheet
            onClose={handleClose}
            onNext={handleCFFinancialsNext}
            onSaveAsDraft={() => {}}
          />
        );

      case "cf_non_financials":
        return (
          <CFNonFinancialsTab
            onClose={handleClose}
            onNext={handleCFNonFinancialsNext}
            onSaveAsDraft={() => {}}
          />
        );

      case "combined_reports":
        return (
          <CombinedReportsSheet
            onClose={handleClose}
            reportData={MOCK_COMBINED_REPORT}
            onSubmitForValidation={handleSubmitForValidation}
            onSaveAsDraft={() => {}}
          />
        );
      // case "validation_review":
      //   return (
      //     <ValidationReviewSheet
      //       onClose={handleClose}
      //       reportData={MOCK_COMBINED_REPORT}
      //       onReturnForRevision={() => setStep("combined_reports")}
      //       onApproveRating={handleApproveRating}
      //     />
      //   );

      default:
        return null;
    }
  };

  return (
    <SheetWrapper
      headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
      titleClassName="text-white px-6 py-4"
      SheetContentClassName="p-0"
      title={SHEET_TITLE[step]}
      open={open}
      setOpen={(val) => {
        if (!val) handleClose();
      }}
      width={SHEET_WIDTH[step]}
    >
      <div className="px-6">{renderContent()}</div>
    </SheetWrapper>
  );
};

export default CaseSheetFlow;
