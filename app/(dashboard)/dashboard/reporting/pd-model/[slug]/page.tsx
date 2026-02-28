import PDModelOutput from "@/components/dashboard/reporting/PDModelOutput";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | PD`,
  description: "Pd model output overview",
};

export default function PdReportingPage() {
  return <PDModelOutput />;
}
