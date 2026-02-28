import EADModelOutput from "@/components/dashboard/reporting/EADModelOutput";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | EAD`,
  description: "Ead model output overview",
};

export default function EADReportingPage() {
  return <EADModelOutput />;
}
