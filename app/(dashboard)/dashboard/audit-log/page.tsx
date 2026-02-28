import ActivityLogTable from "@/components/dashboard/audit-log/ActivityLogTable";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Audit Log`,
  description: "View Users Activities",
};

export default function ActivityPage() {
  return <ActivityLogTable />;
}
