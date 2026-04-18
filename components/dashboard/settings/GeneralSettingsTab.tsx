"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import CustomInputField from "@/components/ui/custom-input-field";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType } from "@/types";
import {
  GeneralSettingsSchema,
  GeneralSettingsFormData,
} from "@/schema/settings";
import {
  useGeneralSettings,
  useSaveGeneralSettings,
} from "@/hooks/use-settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { timezoneOptions } from "@/constants/settings";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

const GeneralSettingsTab = () => {
  const { data, isLoading } = useGeneralSettings();
  const settings = data?.data;

  const form = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(GeneralSettingsSchema),
    defaultValues: {
      application_name: settings?.application_name ?? "",
      timezone: settings?.timezone ?? "Africa/Lagos",
      session_timeout: settings?.session_timeout ?? 30,
      max_upload_size: settings?.max_upload_size ?? 50,
      audit_logging: settings?.audit_logging ?? true,
    },
    values: settings
      ? {
          application_name: settings.application_name,
          timezone: settings.timezone,
          session_timeout: settings.session_timeout,
          max_upload_size: settings.max_upload_size,
          audit_logging: settings.audit_logging,
        }
      : undefined,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  const saveSettings = useSaveGeneralSettings();
  const auditLogging = watch("audit_logging");

  const onSubmit = async (data: GeneralSettingsFormData) => {
    try {
      const response = await saveSettings.mutateAsync(data);
      toast.success(extractSuccessMessage(response));
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const isSaving = saveSettings.isPending || isSubmitting;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h3 className="text-[18px] font-[700] text-[#111827] mb-6">General</h3>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-[16px] border border-[#F3F4F6] p-6 mb-6 max-w-[600px] space-y-4">
            {/* Row: Label + Input side by side */}
            {[
              {
                name: "application_name" as const,
                label: "Application Name",
                description: "Displayed in the browser tab and navigation bar",
                fieldType: FormFieldType.INPUT,
                placeholder: "Ray Process Tool",
              },
              {
                name: "timezone" as const,
                label: "Timezone",
                description: "All timestamps are shown in this timezone",
                fieldType: FormFieldType.SELECT,
                placeholder: "Select timezone",
                options: timezoneOptions,
              },
              {
                name: "session_timeout" as const,
                label: "Session Timeout",
                description:
                  "Automatically sign out inactive users after this many minutes",
                fieldType: FormFieldType.INPUT,
                placeholder: "30",
              },
              {
                name: "max_upload_size" as const,
                label: "Max Upload Size",
                description:
                  "Maximum file size allowed for process inputs (MB)",
                fieldType: FormFieldType.INPUT,
                placeholder: "50",
              },
            ].map(
              ({
                name,
                label,
                description,
                fieldType,
                placeholder,
                options,
              }) => (
                <div
                  key={name}
                  className="flex items-start justify-between gap-6 py-4 border-b border-[#F3F4F6] last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-[14px] font-[600] text-[#111827]">
                      {label}
                    </p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">
                      {description}
                    </p>
                  </div>
                  <div className="w-[200px] flex-shrink-0">
                    <CustomInputField
                      control={control}
                      fieldType={fieldType}
                      name={name}
                      placeholder={placeholder}
                      options={options}
                      className="bg-[#F9FAFB] rounded-[10px] sm:h-[40px] h-[40px] border border-[#E5E7EB]"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              ),
            )}

            {/* Audit logging toggle row */}
            <div className="flex items-start justify-between gap-6 py-4">
              <div className="flex-1">
                <p className="text-[14px] font-[600] text-[#111827]">
                  Audit logging
                </p>
                <p className="text-[12px] text-[#6B7280] mt-0.5">
                  Record every process execution to the activity log
                </p>
              </div>
              <button
                type="button"
                onClick={() => setValue("audit_logging", !auditLogging)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  auditLogging ? "bg-[#F59E0B]" : "bg-[#D1D5DB]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    auditLogging ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <CustomButton
            type="submit"
            title="Save Settings"
            isLoading={isSaving}
            disabled={isSaving}
            className="rounded-[10px] hover:bg-[#005a2d] text-white min-w-[150px] h-[43px]"
          />
        </form>
      </Form>
    </div>
  );
};

export default GeneralSettingsTab;
