"use client";

import React, { useState } from "react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import NewCaseSheet from "./NewCaseSheet";
import PFFinancialsSheet, { PFFinancialsData } from "./PFFinancialsSheet";
import CFFinancialsSheet from "./CFFinancialsSheet";
import PFReportsSheet, {
  CombinedReportsSheet,
  ReportSummaryData,
  CombinedReportData,
} from "./ReportSheets";
import CFScoringSheet from "./CFScoringSheet";
import { CFFinancialsData } from "@/types/risk-overview";

type Step =
  | "model_info" // Step 1 – existing NewCaseSheet
  | "pf_financials" // Step 2a – PF Financials (4 tabs)
  | "pf_reports" // Step 3a – PF Reports
  | "cf_financials" // Step 2b/3b – CF Financials (4 tabs)
  | "cf_scoring" // CF Scoring Sheet
  | "combined_reports"; // Final step when DRE (both PF+CF)

type ProjectPath = "pf_only" | "cf_only" | "combined";

interface CaseSheetFlowProps {
  open: boolean;
  onClose: () => void;
}

// ─── Mock report data – replace with API responses ───────────────────────────
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

// ─── Sheet width config per step ─────────────────────────────────────────────
const SHEET_WIDTH: Record<Step, string> = {
  model_info: "sm:max-w-[500px]",
  pf_financials: "sm:max-w-full",
  pf_reports: "sm:max-w-[780px]",
  cf_financials: "sm:max-w-full",
  cf_scoring: "sm:max-w-[780px]",
  combined_reports: "sm:max-w-[780px]",
};

const SHEET_TITLE: Record<Step, string> = {
  model_info: "Model Information",
  pf_financials: "PF Financials",
  pf_reports: "PF Reports",
  cf_financials: "CF Financials",
  cf_scoring: "CF Scoring Sheet",
  combined_reports: "Combined Reports",
};

const CaseSheetFlow: React.FC<CaseSheetFlowProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<Step>("model_info");
  const [path, setPath] = useState<ProjectPath>("pf_only");

  // Collected form data (can be sent to API at submit)
  const [pfFinancialsData, setPFFinancialsData] =
    useState<PFFinancialsData | null>(null);
  const [cfFinancialsData, setCFFinancialsData] =
    useState<CFFinancialsData | null>(null);

  const handleClose = () => {
    onClose();
    // Reset to first step after animation
    setTimeout(() => setStep("model_info"), 300);
  };

  // ── Step 1: Model Info ──────────────────────────────────────────────────────
  const handleModelInfoSuccess = (dreProject?: string) => {
    // Determine path from dre_project selection
    // "PF" → pf_only, "CF" → cf_only, "DRE" (both) → combined
    const projectLower = (dreProject ?? "").toLowerCase();
    if (projectLower.includes("cf")) {
      setPath("cf_only");
      setStep("cf_financials");
    } else if (
      projectLower.includes("dre") ||
      projectLower.includes("combined")
    ) {
      setPath("combined");
      setStep("pf_financials");
    } else {
      // Default: PF only
      setPath("pf_only");
      setStep("pf_financials");
    }
  };

  // ── Step 2a: PF Financials ─────────────────────────────────────────────────
  const handlePFFinancialsNext = (data: PFFinancialsData) => {
    setPFFinancialsData(data);
    if (path === "combined") {
      setStep("cf_financials"); // Combined → CF next
    } else {
      setStep("pf_reports"); // PF only → reports
    }
  };

  // ── Step 2b/3b: CF Financials ──────────────────────────────────────────────
  const handleCFFinancialsNext = (data: CFFinancialsData) => {
    setCFFinancialsData(data);
    if (path === "combined") {
      setStep("combined_reports");
    } else {
      setStep("cf_scoring");
    }
  };

  // ── Final steps ────────────────────────────────────────────────────────────
  const handleSubmitForValidation = () => {
    // TODO: call validation API
    handleClose();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (step) {
      case "model_info":
        return (
          <NewCaseSheet
            onClose={handleClose}
            onSuccess={(dreProject) => handleModelInfoSuccess(dreProject)}
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

      case "cf_scoring":
        return <CFScoringSheet onClose={handleClose} />;

      case "combined_reports":
        return (
          <CombinedReportsSheet
            onClose={handleClose}
            reportData={MOCK_COMBINED_REPORT}
            onSubmitForValidation={handleSubmitForValidation}
            onSaveAsDraft={() => {}}
          />
        );

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