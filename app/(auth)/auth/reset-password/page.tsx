import ResetPassword from "@/components/auth/ResetPassword";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Reset Password`,
  description: "Set your password here",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
