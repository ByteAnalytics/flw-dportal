import LGDModelOutput from "@/components/dashboard/reporting/LGDModelOutput";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | LGD`,
  description: "Lgd model output overview",
};

export default function LgdReportingPage() {
  return <LGDModelOutput />;
}
