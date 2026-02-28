import ECLModelOutput from "@/components/dashboard/reporting/ECLModelOutput";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | ECL`,
  description: "Ecl model output overview",
};

export default function ECLDetailsPage() {
  return <ECLModelOutput />;
}
