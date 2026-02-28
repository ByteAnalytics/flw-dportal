import ModelExecution from "@/components/dashboard/model-execution";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Model Execution`,
  description: "Select and execute models",
};

export default function ModelExecutionPage() {
  return <ModelExecution />;
}
