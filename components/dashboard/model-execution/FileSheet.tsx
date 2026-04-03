"use client";

import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { FileItem } from "@/components/shared/FileItems";
import FileUploadArea from "@/components/shared/FileUploadArea";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import CustomButton from "@/components/ui/custom-button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { models } from "@/constants/model-execution";
import { formatFileSize } from "@/lib/utils";
import { ExecutableModels } from "@/types/model-execution";
import type { ModelFormData, ThreeFileSet } from "@/types/model-execution";
import { extractModelType } from "@/lib/model-execution-utils";

interface IFileSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedModels: string[];
  modelFormData: ModelFormData;
  setModelFormData: React.Dispatch<React.SetStateAction<ModelFormData>>;
  sharedFileData: ThreeFileSet;
  setSharedFileData: React.Dispatch<React.SetStateAction<ThreeFileSet>>;
  onSubmit: () => void;
}

const DatePicker: React.FC<{
  value: Date;
  onChange: (d: Date) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Exposure Date <span className="text-red-500">*</span>
      </label>
      <div className="relative flex items-center border border-[#e5e5e5] dark:border-neutral-800 px-4 rounded-[8px] h-[48px] overflow-hidden gap-x-4 focus-within:border-[#006D37]">
        <input
          value={value ? format(value, "PPP") : ""}
          placeholder="Select exposure date"
          readOnly
          className="w-full h-full bg-transparent text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] outline-none cursor-pointer"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (date) {
                  onChange(date);
                  setOpen(false);
                }
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const FileUploadField: React.FC<{
  label: string;
  file: File | null;
  onSelect: (f: File) => void;
  onRemove: () => void;
}> = ({ label, file, onSelect, onRemove }) => (
  <div className="flex flex-col gap-2">
    <p className="text-sm font-[500] text-InfraSoftBlack">
      {label} <span className="text-red-500">*</span>
    </p>
    {file ? (
      <FileItem
        fileName={file.name}
        fileSize={formatFileSize(file.size)}
        status="idle"
        onRemove={onRemove}
        onReplace={onRemove}
        showActions
        validationError={null}
      />
    ) : (
      <FileUploadArea onFileSelect={onSelect} />
    )}
  </div>
);

const ThreeFilesSection: React.FC<{
  files: ThreeFileSet;
  onFileChange: (
    key: "amortization_file" | "asset_information_file" | "collateral_file",
    file: File | null,
  ) => void;
  onDateChange: (date: Date) => void;
}> = ({ files, onFileChange, onDateChange }) => (
  <div className="flex flex-col gap-4">
    <DatePicker value={files.exposure_date} onChange={onDateChange} />
    <FileUploadField
      label="Amortization File"
      file={files.amortization_file}
      onSelect={(f) => onFileChange("amortization_file", f)}
      onRemove={() => onFileChange("amortization_file", null)}
    />
    <FileUploadField
      label="Asset Information File"
      file={files.asset_information_file}
      onSelect={(f) => onFileChange("asset_information_file", f)}
      onRemove={() => onFileChange("asset_information_file", null)}
    />
    <FileUploadField
      label="Collateral File"
      file={files.collateral_file}
      onSelect={(f) => onFileChange("collateral_file", f)}
      onRemove={() => onFileChange("collateral_file", null)}
    />
  </div>
);

const hasAllThreeFiles = (d: ThreeFileSet) =>
  !!d.amortization_file && !!d.asset_information_file && !!d.collateral_file;

export const isModelRunnable = (
  modelId: string,
  data: ModelFormData,
): boolean => {
  const id = modelId?.toLowerCase();
  if (ExecutableModels.LGD.startsWith(id)) return hasAllThreeFiles(data.lgd);
  if (ExecutableModels.EAD.startsWith(id)) return hasAllThreeFiles(data.ead);
  if (ExecutableModels.ECL.startsWith(id)) return hasAllThreeFiles(data.ecl);
  return true;
};

export const FileSheet: React.FC<IFileSheetProps> = ({
  isOpen,
  setIsOpen,
  selectedModels,
  modelFormData,
  setModelFormData,
  sharedFileData,
  setSharedFileData,
  onSubmit,
}) => {
  const filteredModels = models.filter((m) => selectedModels.includes(m.id));

  const allRunnable = hasAllThreeFiles(sharedFileData);

  const updateSharedFile = (
    key: "amortization_file" | "asset_information_file" | "collateral_file",
    file: File | null,
  ) => {
    setSharedFileData((prev) => ({ ...prev, [key]: file }));
  };

  return (
    <SheetWrapper title="Add Files" open={isOpen} setOpen={setIsOpen}>
      <div className="flex flex-col gap-6 h-[95%] pb-6">
        <div className="flex flex-col gap-8 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-[700] text-[#5B5F5E]">
                Add Files
              </span>
              <span className="text-xs text-[#A3A3A3]">
                {filteredModels.length > 1
                  ? `These files will be used across all selected models: ${filteredModels
                      .map((m) => extractModelType(m.id)?.toUpperCase())
                      .join(", ")}`
                  : `Files for ${extractModelType(filteredModels[0]?.id)?.toUpperCase()} model`}
              </span>
            </div>

            <ThreeFilesSection
              files={sharedFileData}
              onFileChange={updateSharedFile}
              onDateChange={(date) =>
                setSharedFileData((prev) => ({ ...prev, exposure_date: date }))
              }
            />
          </div>
        </div>

        <CustomButton
          title="Run Models"
          onClick={onSubmit}
          disabled={!allRunnable}
          textClassName="!text-[0.875rem] font-[600]"
          className={`w-full rounded-[12px] h-[45px] ${
            allRunnable
              ? "bg-[#006D37] hover:bg-[#005A2E]"
              : "bg-gray-200 !text-gray-400 cursor-not-allowed"
          }`}
        />
      </div>
    </SheetWrapper>
  );
};