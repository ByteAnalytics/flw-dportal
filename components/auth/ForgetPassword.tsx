"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Form } from "../ui/form";
import CustomInputField from "../ui/custom-input-field";
import CustomButton from "../ui/custom-button";
import { CustomImage } from "../ui/custom-image";
import { FormFieldType } from "@/types";
import keyLogo from "@/public/assets/icon/Featured icon.svg";
import { useState } from "react";
import SuccessModal from "../shared/SuccessModal";
import { CustomModal } from "../ui/custom-modal";
import { authService } from "@/api/auth-service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { z } from "zod";
import { useRouter } from "next/navigation";

const ForgotPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      await authService.forgetPassword(values.email);
      setShowSuccessModal(true);
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
            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-[3.5rem] w-[3.5rem] rounded-full bg-[#F7EEE2] opacity-75 animate-ping" />
              <CustomImage src={keyLogo} style="w-[3.5rem] h-[3.5rem]" />
            </div>

            <h1 className="mt-[0.5rem] text-[1.6rem] md:text-[1.7rem] font-normal leading-[100%]">
              Forgot password?
            </h1>
            <h2 className="text-center text-base font-[600] text-gray-500">
              {"No worries! Enter your email and we'll send you reset instructions."}
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-4 mt-4"
              >
                <CustomInputField
                  name="email"
                  label="Email Address"
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                />

                <div className="flex flex-col gap-[1.25rem]">
                  <CustomButton
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    title="Send Reset Instructions"
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

      {/* Success Modal */}
      <CustomModal
        open={showSuccessModal}
        bg="bg-[#FFFFFF]"
        setOpen={setShowSuccessModal}
      >
        <SuccessModal
          title="Check your email"
          description="We've sent password reset instructions to your email address. Please check your inbox."
          rightAction={{
            label: "Back to Log In",
            onClick: () => {
              setShowSuccessModal(false);
              router.push("/auth/sign-in");
            },
          }}
        />
      </CustomModal>
    </div>
  );
};

export default ForgotPassword;
