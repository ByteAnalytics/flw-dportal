import Teams from "@/components/dashboard/team-management";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Team Management`,
  description: "Manage Users Role and Permisssions",
};

export default function TeamManagementPage() {
  return <Teams/>;
}
