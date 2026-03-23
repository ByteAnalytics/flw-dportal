"use client";

import React, { useState, useEffect } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExportToEmailFormData,
  ExportToEmailFormSchema,
} from "@/schema/export-to-email";
import CustomButton from "@/components/ui/custom-button";
import { Form } from "@/components/ui/form";
import { ApiResponse, FormFieldType, UserRole } from "@/types";
import { useGet, usePost } from "@/hooks/use-queries";
import { TeamUsersResponse } from "@/types/team-management";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "../ui/loading-spinner";
import { toast } from "sonner";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import CustomInputField from "../ui/custom-input-field";
import { useAuthStore } from "@/stores/auth-store";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ExportToEmailProp {
  isEmailPromptOpen: boolean;
  setIsEmailPromptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  emailExportApiUrl: string;
}

export const ExportToEmail: React.FC<ExportToEmailProp> = ({
  isEmailPromptOpen,
  setIsEmailPromptOpen,
  emailExportApiUrl,
}) => {
  // const { user } = useAuthStore((s) => s);

  // const isAdmin = user?.role === UserRole?.ADMIN;

  const { data, isLoading } = useGet<TeamUsersResponse>(
    ["users", "email-recipients"],
    "/users/email_recipients",
    // {
    //   enabled: isAdmin,
    // },
  );

  const sendToEmail = usePost<ApiResponse<null>, any>(emailExportApiUrl, [
    "send-to-email",
  ]);

  const form = useForm<ExportToEmailFormData>({
    resolver: zodResolver(ExportToEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailValue = form.watch("email");
  const selectedRecipients = emailValue
    ? emailValue.split(", ").filter(Boolean)
    : [];

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      const defaultRecipients = data.data
        .filter((user) => user.is_email_recipient)
        .map((user) => user.email);

      form.setValue("email", defaultRecipients.join(", "));
    }
  }, [data?.data, form]);

  const toggleRecipient = (email: string) => {
    const updated = selectedRecipients.includes(email)
      ? selectedRecipients.filter((e) => e !== email)
      : [...selectedRecipients, email];

    form.setValue("email", updated.join(", "));
  };

  const handleSubmitForm = async (values: ExportToEmailFormData) => {
    try {
      const response = await sendToEmail.mutateAsync({
        recipients: selectedRecipients,
      });
      toast.success(extractSuccessMessage(response));
      setIsEmailPromptOpen(false);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <CustomModal
      open={isEmailPromptOpen}
      bg="bg-[#FFFFFF]"
      setOpen={setIsEmailPromptOpen}
      title="Export to Email"
      width="max-w-xl"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="flex w-full flex-col gap-6 mt-2"
        >
          <CustomInputField
            name="email"
            label="Add Email (s)"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Input email and separate emails with comma for multiple emails"
            disabled={true}
          />

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium text-[#5B5F5E]">
              Recipients
            </Label>

            {isLoading ? (
              <LoadingSpinner />
            ) : data?.data && data.data.length > 0 ? (
              <div className="flex flex-col gap-2 overflow-auto custom-scroll max-h-[70vh]">
                {data.data.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 text-sm text-[#111827] rounded-md py-1 transition-colors"
                  >
                    <Checkbox
                      id={`recipient-${user.id}`}
                      checked={selectedRecipients?.includes(user.email)}
                      onCheckedChange={() => toggleRecipient(user.email)}
                      className="text-[#006F37] border-[#006F37] data-[state=checked]:bg-[#006F37]"
                    />
                    <Label
                      htmlFor={`recipient-${user.id}`}
                      className="cursor-pointer text-sm font-[400] text-[#5B5F5E]"
                    >
                      {user.first_name} {user.last_name} ({user.email})
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recipients found</p>
            )}
          </div>

          <CustomButton
            disabled={sendToEmail.isPending}
            isLoading={sendToEmail.isPending}
            textClassName="text-white"
            title="Submit"
          />
        </form>
      </Form>
    </CustomModal>
  );
};
