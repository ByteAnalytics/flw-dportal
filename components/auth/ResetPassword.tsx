"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Form } from "../ui/form";
import CustomInputField from "../ui/custom-input-field";
import CustomButton from "../ui/custom-button";
import { CustomImage } from "../ui/custom-image";
import {
  ResetPasswordFormSchema,
  ResetPasswordFormData,
} from "@/schema/reset-password";
import { FormFieldType } from "@/types";
import keyLogo from "@/public/assets/icon/Featured icon.svg";
import { useState } from "react";
import SuccessModal from "../shared/SuccessModal";
import { CustomModal } from "../ui/custom-modal";
import { authService } from "@/api/auth-service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";

const ResetPassword: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showToast, setShowToast] = useState(false);
  const rawToken = searchParams.get("token") || "";

 const [token, emailParam] = rawToken.split("?email=");
  const email = emailParam || searchParams.get("email") || "";

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      pwd: "",
      cpwd: "",
    },
  });

 const onSubmit = async (values: ResetPasswordFormData) => {
   try {
     setIsSubmitting(true);
     await authService.resetPassword(values.pwd, token, email); 
     setShowToast(true);
   } catch (err: any) {
     toast.error(extractErrorMessage(err));
   } finally {
     setIsSubmitting(false);
   }
 };

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="flex h-full w-full items-center justify-center overflow-y-auto">
        <div className="my-auto w-full max-w-md px-4 py-[2rem]">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-[3.5rem] w-[3.5rem] rounded-full bg-[#F7EEE2] opacity-75 animate-ping" />
              <CustomImage src={keyLogo} style="w-[3.5rem] h-[3.5rem]" />
            </div>

            <h1 className="mt-[0.5rem] text-[1.6rem] md:text-[1.7rem] font-normal leading-[100%]">
              Set new password
            </h1>
            <h2 className="text-center text-base font-[600] text-gray-500">
              Your new password must be different from previously used
              passwords.
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-4 mt-4"
              >
                <CustomInputField
                  name="pwd"
                  label="Password"
                  control={form.control}
                  fieldType={FormFieldType.PASSWORD}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />

                <CustomInputField
                  name="cpwd"
                  label="Confirm Password"
                  control={form.control}
                  fieldType={FormFieldType.PASSWORD}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                />
                <div className="flex flex-col gap-[1.25rem]">
                  <CustomButton
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    title="Submit"
                    className="mb-[1rem] flex w-full items-center justify-center bg-primary_40 font-medium text-white"
                  />
                  <Link
                    href="/auth/sign-in"
                    className="m-auto flex items-center justify-center text-sm text-[#667085]"
                  >
                    <ChevronLeft className="mr-[0.25rem] inline w-4 h-4" />
                    Back to Log In
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <CustomModal open={showToast} bg="bg-[#FFFFFF]" setOpen={setShowToast}>
        <SuccessModal
          title="Password Reset Successful"
          description="Your password reset is successful. proceed to dashboard."
          rightAction={{
            label: "Proceed to Dashboard",
            onClick: () => {
              setShowToast(false);
              router.push("/dashboard/reporting/");
            },
          }}
        />
      </CustomModal>
    </div>
  );
};

export default ResetPassword;
