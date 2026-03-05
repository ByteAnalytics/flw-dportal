import ForgotPassword from "@/components/auth/ForgetPassword";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Forgot Password`,
  description: "Get your reset password mail here",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
