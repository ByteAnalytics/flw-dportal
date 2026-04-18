"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import CustomInputField from "@/components/ui/custom-input-field";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType } from "@/types";
import { OnboardUserSchema, OnboardUserFormData } from "@/schema/settings";
import { useOnboardUser } from "@/hooks/use-teams";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

interface OnboardUserSheetProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const OnboardUserSheet: React.FC<OnboardUserSheetProps> = ({
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

 const form = useForm<OnboardUserFormData>({
   resolver: zodResolver(OnboardUserSchema),
   defaultValues: {
     first_name: "",
     last_name: "",
     email: "",
     password: "",
     role: "user",
   },
 });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onboardUser = useOnboardUser();

  const refreshUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["users"],
      exact: false,
      refetchType: "all",
    });
  };

  const onSubmit = async (data: OnboardUserFormData) => {
    try {
      const response = await onboardUser.mutateAsync(data);
      toast.success(extractSuccessMessage(response));
      await refreshUsers();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const isLoading = onboardUser.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-6 h-[85%] pb-6">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          <div className="h-full space-y-4 overflow-y-auto">
            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="first_name"
              label="First Name"
              placeholder="e.g. John"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="last_name"
              label="Last Name"
              placeholder="e.g. Doe"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.EMAIL}
              name="email"
              label="Email Address"
              placeholder="e.g. john.doe@company.com"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.PASSWORD}
              name="password"
              label="Password"
              placeholder="Min. 8 characters"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="role"
              label="Role"
              placeholder="Select role"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              options={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
              ]}
              disabled={isLoading}
            />
          </div>

          <div className="pt-6">
            <CustomButton
              type="submit"
              title="Onboard User"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full hover:bg-[#005a2d] text-white rounded-[8px]"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OnboardUserSheet;
