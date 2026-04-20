import ProfileDetails from "@/components/dashboard/profile";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Profile Details`,
  description: "Edit Your Profile Information",
};

export default function ProfilePage() {
  return <ProfileDetails />;
}
