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

interface IFileSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedModels: string[];
  selectedModelFiles: Record<string, File | null>;
  setSelectedModelFiles: React.Dispatch<
    React.SetStateAction<Record<string, File | null>>
  >;
  executionDate: Date;
  setExecutionDate: (date: Date) => void;
  onSubmit: () => void;
}

export const FileSheet: React.FC<IFileSheetProps> = ({
  isOpen,
  setIsOpen,
  selectedModels,
  selectedModelFiles,
  setSelectedModelFiles,
  executionDate,
  setExecutionDate,
  onSubmit,
}) => {
  const [dateOpen, setDateOpen] = React.useState(false);

  const filteredModels = models.filter((m) => selectedModels.includes(m.id));
  const allFilesSelected = filteredModels.every(
    (m) => !!selectedModelFiles[m.id],
  );

  const handleFileSelect = (modelId: string, file: File) => {
    setSelectedModelFiles((prev) => ({ ...prev, [modelId]: file }));
  };

  const handleRemoveFile = (modelId: string) => {
    setSelectedModelFiles((prev) => ({ ...prev, [modelId]: null }));
  };

  return (
    <SheetWrapper title="Add Files" open={isOpen} setOpen={setIsOpen}>
      <div className="flex flex-col gap-6 h-[95%] pb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Execution Date
          </label>
          <div className="relative flex items-center border border-[#e5e5e5] dark:border-neutral-800 px-4 rounded-[8px] h-[48px] overflow-hidden gap-x-4 focus-within:border-[#006D37]">
            <input
              value={executionDate ? format(executionDate, "PPP") : ""}
              placeholder="Select execution date"
              readOnly
              className="w-full h-full bg-transparent text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] outline-none cursor-pointer"
            />
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
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
                  selected={executionDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date) {
                      setExecutionDate(date);
                      setDateOpen(false);
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

        <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
          {filteredModels.map((model) => {
            const file = selectedModelFiles[model.id] ?? null;
            const hasFile = !!file;

            return (
              <div key={model.id} className="flex flex-col gap-2">
                <p className="text-sm font-[500] text-InfraSoftBlack">
                  {model.id?.toUpperCase()} File
                </p>
                {hasFile ? (
                  <FileItem
                    fileName={file!.name}
                    fileSize={formatFileSize(file!.size)}
                    status="idle"
                    onRemove={() => handleRemoveFile(model.id)}
                    onReplace={() => handleRemoveFile(model.id)}
                    showActions
                    validationError={null}
                  />
                ) : (
                  <FileUploadArea
                    onFileSelect={(f) => handleFileSelect(model.id, f)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <CustomButton
          title="Run Models"
          onClick={onSubmit}
          disabled={!allFilesSelected}
          textClassName="!text-[0.875rem] font-[600]"
          className={`w-full rounded-[12px] h-[45px] ${
            allFilesSelected
              ? "bg-[#006D37] hover:bg-[#005A2E]"
              : "bg-gray-200 !text-gray-400 cursor-not-allowed"
          }`}
        />
      </div>
    </SheetWrapper>
  );
};
