import ModelManagement from "@/components/dashboard/model-management";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Model Management`,
  description: "Select and execute models",
};

export default function ModelManagementPage() {
  return <ModelManagement />;
}
