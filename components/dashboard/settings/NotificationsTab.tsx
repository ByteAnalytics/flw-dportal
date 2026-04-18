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
  NotificationSettingsSchema,
  NotificationSettingsFormData,
} from "@/schema/settings";
import {
  useNotificationSettings,
  useSaveNotificationSettings,
} from "@/hooks/use-settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NOTIFICATION_LABELS } from "@/constants/settings";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

const PROCESS_ALERT_KEYS = [
  "process_completion",
  "process_failure",
  "daily_email_summary",
] as const;

const SYSTEM_ALERT_KEYS = [
  "api_integration_offline",
  "new_user_onboarded",
] as const;

const NotificationsTab = () => {
  const { data, isLoading } = useNotificationSettings();
  const settings = data?.data;

  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(NotificationSettingsSchema),
    defaultValues: {
      process_completion: settings?.process_completion ?? true,
      process_failure: settings?.process_failure ?? true,
      daily_email_summary: settings?.daily_email_summary ?? false,
      api_integration_offline: settings?.api_integration_offline ?? true,
      new_user_onboarded: settings?.new_user_onboarded ?? true,
      default_slack_channel: settings?.default_slack_channel ?? "",
    },
    values: settings
      ? {
          process_completion: settings.process_completion,
          process_failure: settings.process_failure,
          daily_email_summary: settings.daily_email_summary,
          api_integration_offline: settings.api_integration_offline,
          new_user_onboarded: settings.new_user_onboarded,
          default_slack_channel: settings.default_slack_channel,
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

  const saveSettings = useSaveNotificationSettings();

  const onSubmit = async (data: NotificationSettingsFormData) => {
    try {
      const response = await saveSettings.mutateAsync(data);
      toast.success(extractSuccessMessage(response));
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const isSaving = saveSettings.isPending || isSubmitting;

  if (isLoading) return <LoadingSpinner />;

  const ToggleRow: React.FC<{
    fieldKey: keyof NotificationSettingsFormData;
  }> = ({ fieldKey }) => {
    const value = watch(fieldKey as any) as boolean;
    const { title, description } = NOTIFICATION_LABELS[fieldKey as string] ?? {
      title: String(fieldKey),
      description: "",
    };
    return (
      <div className="flex items-start justify-between py-4 border-b border-[#F3F4F6] last:border-0">
        <div className="flex-1 pr-8">
          <p className="text-[14px] font-[600] text-[#111827]">{title}</p>
          <p className="text-[12px] text-[#6B7280] mt-0.5">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setValue(fieldKey as any, !value)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
            value ? "bg-[#F59E0B]" : "bg-[#D1D5DB]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-[18px] font-[700] text-[#111827] mb-6">
        Notifications
      </h3>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-[16px] border border-[#F3F4F6] p-6 mb-6">
            {/* Process Alerts */}
            <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider mb-2">
              Process Alerts
            </p>
            {PROCESS_ALERT_KEYS.map((key) => (
              <ToggleRow key={key} fieldKey={key} />
            ))}

            {/* System Alerts */}
            <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider mt-6 mb-2">
              System Alerts
            </p>
            {SYSTEM_ALERT_KEYS.map((key) => (
              <ToggleRow key={key} fieldKey={key} />
            ))}
          </div>

          {/* Default Slack Channel */}
          <div className="mb-6 max-w-[400px]">
            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="default_slack_channel"
              label="Default Slack Channel"
              placeholder="#ops-automation"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isSaving}
            />
          </div>

          <CustomButton
            type="submit"
            title="Save Preferences"
            isLoading={isSaving}
            disabled={isSaving}
            className="rounded-[10px] hover:bg-[#005a2d] text-white min-w-[160px] h-[43px]"
          />
        </form>
      </Form>
    </div>
  );
};

export default NotificationsTab;
