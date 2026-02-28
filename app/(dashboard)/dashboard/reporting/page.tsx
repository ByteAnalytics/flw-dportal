import Reporting from "@/components/dashboard/reporting";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Reporting`,
  description: "View and exports reports",
};

export default function ReportingPage() {
  return <Reporting />;
}
