import ResetPassword from "@/components/auth/ResetPassword";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Forgot Password`,
  description: "Get your reset password mail here",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
