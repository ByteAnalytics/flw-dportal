import FLIModelOutput from "@/components/dashboard/reporting/FLIModelOutput";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | FLI`,
  description: "FLI model output overview",
};

export default function FliReportingPage() {
  return <FLIModelOutput />;
}
