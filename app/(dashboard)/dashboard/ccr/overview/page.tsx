import CaseOverviewPage from "@/components/dashboard/risk-overview";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Credit Risk Rating Overview`,
  description: "View system summary",
};

export default function CaseOverviewDashboardPage() {
  return <CaseOverviewPage />;
}
