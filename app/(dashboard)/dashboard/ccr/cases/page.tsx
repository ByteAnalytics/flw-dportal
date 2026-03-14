import RiskCases from "@/components/dashboard/risk-cases";
import CaseOverviewPage from "@/components/dashboard/risk-overview";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Credit Risk Rating Cases`,
  description: "Credit Risk Rating Cases",
};

export default function CasePage() {
  return <RiskCases />;
}
