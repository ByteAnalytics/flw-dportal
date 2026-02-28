import SignIn from "@/components/auth/SignIn";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${EnvironmentHelper.getMetaTitle()} | Login`,
  description: `Log into your ${EnvironmentHelper.getMetaTitle()} dashboard account`,
};

export default function SignInPage() {
  return <SignIn />;
}
