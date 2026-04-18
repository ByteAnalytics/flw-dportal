"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Info, Calendar, Flag, FileText, Bell } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType } from "@/types";
import CustomInputField from "@/components/ui/custom-input-field";
import { DataSourceType, Process } from "@/types/processes";

interface ConfigureStepProps {
  process: Process;
  dataSource: DataSourceType;
  onBack: () => void;
  onExecute: () => void;
}

// Form values type
interface ConfigureFormValues {
  outputFormat: string;
  notificationChannel: string;
  dateFrom: string;
  dateTo: string;
  priority: string;
  notes: string;
}

const DS_LABEL: Record<NonNullable<DataSourceType>, string> = {
  both: "Upload + API",
  api: "API Connection",
  upload: "File Upload",
};

// Configuration fields configuration
const CONFIGURATION_FIELDS = [
  {
    name: "outputFormat" as const,
    label: "Output Format",
    fieldType: FormFieldType.INPUT,
    placeholder: "Auto-detect (recommended)",
    defaultValue: "Auto-detect (recommended)",
  },
  {
    name: "notificationChannel" as const,
    label: "Notification Channel",
    fieldType: FormFieldType.INPUT,
    placeholder: "Slack (#ops-automation)",
    defaultValue: "Slack (#ops-automation)",
  },
];

const DATE_FIELDS = [
  {
    name: "dateFrom" as const,
    label: "Date From",
    fieldType: FormFieldType.DATE,
    defaultValue: "2026-03-25",
  },
  {
    name: "dateTo" as const,
    label: "Date To",
    fieldType: FormFieldType.DATE,
    defaultValue: "2026-03-26",
  },
];

// Priority options
const PRIORITY_OPTIONS = ["Normal", "High", "Low", "Urgent"];

// Reusable Summary Item Component
interface SummaryItemProps {
  label: string;
  value: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => (
  <div>
    <p className="text-[11px] text-[#9A9E9D] mb-1">{label}</p>
    <p className="text-[12px] font-semibold text-[#0A0A0A] leading-snug">
      {value}
    </p>
  </div>
);

// Reusable Footer Action Component
interface FooterActionsProps {
  onBack: () => void;
  onExecute: () => void;
  showInfoNote?: boolean;
  backButtonText?: string;
  executeButtonText?: string;
  isSubmitting?: boolean;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  onBack,
  onExecute,
  showInfoNote = true,
  backButtonText = "Back",
  executeButtonText = "Execute",
  isSubmitting = false,
}) => (
  <div className="flex items-center justify-between pt-3 border-t border-[#E1E3E2] mt-auto">
    <button
      onClick={onBack}
      disabled={isSubmitting}
      className="flex items-center gap-1.5 bg-white border border-[#E1E3E2] rounded-[10px] px-4 py-2.5 text-[13px] font-medium text-[#5B5F5E] hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> {backButtonText}
    </button>

    {showInfoNote && (
      <div className="flex items-center gap-1.5 text-[11px] text-[#9A9E9D]">
        <Info className="w-3.5 h-3.5" /> Human review required at completion
      </div>
    )}

    <CustomButton
      title={isSubmitting ? "Executing..." : executeButtonText}
      onClick={onExecute}
      disabled={isSubmitting}
      textClassName="!text-[0.875rem] font-[600]"
      className="rounded-[8px] !h-[38px] min-w-[110px] bg-[#E8A020] hover:bg-[#D4911A] disabled:opacity-50"
    />
  </div>
);

export const ConfigureStep: React.FC<ConfigureStepProps> = ({
  process,
  dataSource,
  onBack,
  onExecute,
}) => {
  const dsLabel = dataSource ? DS_LABEL[dataSource] : "—";

  const { control, handleSubmit, watch } = useForm<ConfigureFormValues>({
    defaultValues: {
      outputFormat: "Auto-detect (recommended)",
      notificationChannel: "Slack (#ops-automation)",
      dateFrom: "2026-03-25",
      dateTo: "2026-03-26",
      priority: "Normal",
      notes: "",
    },
  });

  const watchedValues = watch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (values: ConfigureFormValues) => {
    setIsSubmitting(true);
    try {
      // You can process the form values here if needed
      console.log("Form values:", values);
      onExecute();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Summary items configuration
  const SUMMARY_ITEMS = [
    { label: "Process", value: process.process_name },
    { label: "Data Source", value: dsLabel },
    { label: "APIs Connected", value: "Arbiter 2.0, CC Portal, Slack" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Process description */}
      <div className="bg-[#F9F9F9] rounded-[10px] p-3.5 text-[12px] text-[#7A7E7D] leading-relaxed">
        User logs into Arbiter 2.0 portal to spool disputes from different
        segments (IPG, Visa-Co Acquired, Afrigo, POS). Validate claims on CC
        portal to confirm statuses. For successful transactions confirm
        settlement and accept on Arbiter. For failed transactions collate with
        template, upload on CC against merchant to validate (10 working hours
        SLA).
      </div>

      {/* Configuration Fields Grid */}
      <div className="grid grid-cols-2 gap-3">
        {CONFIGURATION_FIELDS.map((field) => (
          <CustomInputField
            key={field.name}
            control={control}
            fieldType={field.fieldType}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            icon={<Bell className="w-4 h-4 text-[#A3A3A3]" />}
          />
        ))}
      </div>

      {/* Date Fields Grid */}
      <div className="grid grid-cols-2 gap-3">
        {DATE_FIELDS.map((field) => (
          <CustomInputField
            key={field.name}
            control={control}
            fieldType={field.fieldType}
            name={field.name}
            label={field.label}
            icon={<Calendar className="w-4 h-4 text-[#A3A3A3]" />}
          />
        ))}
      </div>

      {/* Priority Field - Using SELECT */}
      <CustomInputField
        control={control}
        fieldType={FormFieldType.SELECT}
        name="priority"
        label="Priority"
        placeholder="Select priority level"
        options={PRIORITY_OPTIONS}
        icon={<Flag className="w-4 h-4 text-[#A3A3A3]" />}
      />

      {/* Notes Field - Using TEXTAREA */}
      <CustomInputField
        control={control}
        fieldType={FormFieldType.TEXTAREA}
        name="notes"
        label="Notes (optional)"
        placeholder="Any additional context for this execution..."
        icon={<FileText className="w-4 h-4 text-[#A3A3A3]" />}
      />

      {/* Execution Summary */}
      <div className="bg-[#F3F3F3] rounded-[10px] p-3.5">
        <p className="text-[10px] font-bold text-[#9A9E9D] uppercase tracking-wider mb-3">
          Execution Summary
        </p>
        <div className="grid grid-cols-3 gap-2">
          {SUMMARY_ITEMS.map((item) => (
            <SummaryItem
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>

      {/* Live Preview of Selected Values (Optional) */}
      <div className="text-[10px] text-[#9A9E9D] px-1">
        <p>Configuration Preview:</p>
        <ul className="mt-1 space-y-0.5">
          <li>• Output: {watchedValues.outputFormat}</li>
          <li>• Channel: {watchedValues.notificationChannel}</li>
          <li>
            • Date Range: {watchedValues.dateFrom} to {watchedValues.dateTo}
          </li>
          <li>• Priority: {watchedValues.priority}</li>
        </ul>
      </div>

      {/* Footer Actions */}
      <FooterActions
        onBack={onBack}
        onExecute={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};
