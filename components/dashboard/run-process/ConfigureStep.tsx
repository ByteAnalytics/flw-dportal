"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType } from "@/types";
import CustomInputField from "@/components/ui/custom-input-field";
import { DataSourceType, Process } from "@/types/processes";
import {
  useRunProcess,
  buildRunProcessPayload,
  RunProcessResponse,
} from "@/hooks/use-run-process";
import { extractErrorMessage } from "@/lib/utils";

interface ConfigureStepProps {
  process: Process;
  dataSource: DataSourceType;
  files?: File[];
  onBack: () => void;
  onExecute: (result: RunProcessResponse) => void;
}

interface ConfigureFormValues {
  dateFrom: string;
  dateTo: string;
  currency: string;
}

const DS_LABEL: Record<NonNullable<DataSourceType>, string> = {
  both: "Upload + API",
  api: "API Connection",
  upload: "File Upload",
};

const DATE_FIELDS = [
  {
    name: "dateFrom" as const,
    label: "From",
    fieldType: FormFieldType.DATE,
  },
  {
    name: "dateTo" as const,
    label: "To",
    fieldType: FormFieldType.DATE,
  },
];

const CONFIGURATION_FIELDS = [
  {
    name: "currency" as const,
    label: "Currency",
    fieldType: FormFieldType.INPUT,
    placeholder: "Currency",
  },
];

const SummaryItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-[11px] text-[#9A9E9D] mb-1">{label}</p>
    <p className="text-[12px] font-semibold text-[#0A0A0A] leading-snug">
      {value}
    </p>
  </div>
);

export const ConfigureStep: React.FC<ConfigureStepProps> = ({
  process,
  dataSource,
  files = [],
  onExecute,
}) => {
  const dsLabel = dataSource ? DS_LABEL[dataSource] : "—";
  const { mutateAsync: runProcess, isPending } = useRunProcess();

  const { control, handleSubmit } = useForm<ConfigureFormValues>({
    defaultValues: {
      dateFrom: "2026-03-25",
      dateTo: "2026-03-26",
      currency: "NGN",
    },
  });

  const SUMMARY_ITEMS = [
    { label: "Process", value: process.process_name },
    { label: "Data Source", value: dsLabel },
    {
      label: "Files",
      value: files.length > 0 ? `${files.length} file(s)` : "None",
    },
  ];

  const onSubmit = async () => {
    const payload = buildRunProcessPayload(process.process_name, files);
    try {
      const result = await runProcess(payload);
      onExecute(result);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to run process"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 h-full"
    >
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 bg-[#F9F9F9] rounded-[10px] p-3 border border-[#E1E3E2]">
        {SUMMARY_ITEMS.map((item) => (
          <SummaryItem key={item.label} {...item} />
        ))}
      </div>

      {/* Date fields */}
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

      {/* Config fields */}
      <div className="grid grid-cols-1 gap-3">
        {CONFIGURATION_FIELDS.map((field) => (
          <CustomInputField
            key={field.name}
            control={control}
            fieldType={field.fieldType}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-[#E1E3E2]">
        <CustomButton
          title={isPending ? "Executing..." : "Execute"}
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          isLoading={isPending}
          textClassName="!text-[0.875rem] font-[600]"
          className="rounded-[8px] !h-[38px] w-full disabled:opacity-50"
        />
      </div>
    </form>
  );
};
