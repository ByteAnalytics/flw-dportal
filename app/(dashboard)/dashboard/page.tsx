import Dashboard from "@/components/dashboard/overview";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Dashboard Overview`,
  description: "View system summary",
};

export default function DashboardPage() {
  return <Dashboard />;
}
