"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import SuccessModal from "@/components/shared/SuccessModal";
import FileUploadArea from "../../shared/FileUploadArea";
import { FileItem } from "../../shared/FileItems";
import CustomButton from "@/components/ui/custom-button";
import ModelCard from "./ModelCard";
import { CustomModal } from "@/components/ui/custom-modal";
import { Form } from "@/components/ui/form";
import CustomInputField from "@/components/ui/custom-input-field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ValidationErrorSheet from "@/components/shared/ValidationErrorSheet";

import { usePost } from "@/hooks/use-queries";
import { models } from "@/constants/model-management";
import { ApiResponse, FormFieldType } from "@/types";
import {
  ExecutableModels,
  ModelManagementApiResponse,
} from "@/types/model-execution";
import {
  extractErrorMessage,
  extractSuccessMessage,
  formatFileSize,
  isValidDate,
} from "@/lib/utils";
import {
  ModelExecutionFormData,
  ModelExecutionFormSchema,
} from "@/schema/model-management";
import { useUploadProgress } from "@/hooks/use-upload-progress";
import { extractValidationPayload } from "@/lib/parse-validation-error";
import type { ValidationErrorPayload } from "@/lib/parse-validation-error";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ModelManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [errorSheetOpen, setErrorSheetOpen] = useState(false);
  const [validationError, setValidationError] =
    useState<ValidationErrorPayload | null>(null);

  const toastIdRef = React.useRef<string | number | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    uploadStep,
    uploadProgress,
    startProgress,
    completeProgress,
    resetProgress,
    setUploadStep,
    isUploading,
  } = useUploadProgress();

  const form = useForm<ModelExecutionFormData>({
    resolver: zodResolver(ModelExecutionFormSchema),
    defaultValues: {
      execution_date: new Date(),
      upTurn: 0,
      downTurn: 0,
      base: 0,
    },
  });

  const isFLIModel = selectedModelType === ExecutableModels.FLI;
  const isPDModel = selectedModelType === ExecutableModels.PD;

  const executePDModel = usePost<
    ApiResponse<ModelManagementApiResponse>,
    FormData
  >("/models/pd", ["execution-models"]);

  const executeFLIModel = usePost<ApiResponse<ModelManagementApiResponse>, any>(
    "/models/fli",
    ["execution-models"],
  );

  const executeModel = isPDModel ? executePDModel : executeFLIModel;

  const displayErrorSheet = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    setErrorSheetOpen(true);
  };

  const resetAllState = () => {
    setSelectedModelType("");
    resetProgress();
    setSelectedFile(null);
    setShowSuccess(false);
    setIsModalOpen(false);
    setValidationError(null);
    setErrorSheetOpen(false);
    form.reset();
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  const navigateToPDPage = () => {
    resetAllState();
    router.push("/dashboard/reporting/");
  };

  const handleRunModel = (modelType: string) => {
    setSelectedModelType(modelType);
    setIsModalOpen(true);
    resetProgress();
    setSelectedFile(null);
    form.reset({
      execution_date: new Date(),
      upTurn: 0,
      downTurn: 0,
      base: 0,
    });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadStep("idle");
  };

  const resetFileState = () => {
    setSelectedFile(null);
    setValidationError(null);
    resetProgress();
  };

  const validateFLIForm = (formData: ModelExecutionFormData) => {
    const { base, upTurn, downTurn } = formData;
    return (
      base !== undefined &&
      base !== null &&
      upTurn !== undefined &&
      upTurn !== null &&
      downTurn !== undefined &&
      downTurn !== null
    );
  };

  const validateForm = () => {
    if (!selectedModelType) {
      toast.error("Please select a model type");
      return false;
    }

    if (isPDModel && !selectedFile) {
      toast.error("Please select a file for PD model");
      return false;
    }

    if (isFLIModel && !validateFLIForm(form.getValues())) {
      toast.error("Please provide base, upTurn, and downTurn for FLI model");
      return false;
    }

    return true;
  };

  const executeModelWithFile = async (
    formDataValues: ModelExecutionFormData,
  ) => {
    if (!validateForm()) return;

    const cleanupProgress = startProgress();

    try {
      const executionDate = formDataValues?.execution_date
        ? format(formDataValues.execution_date, "yyyy-MM-dd")
        : new Date().toISOString().split("T")[0];

      let payload: any;

      if (isPDModel) {
        const formData = new FormData();
        formData.append("execution_date", executionDate);
        formData.append("execution_model_type", selectedModelType);
        if (selectedFile) formData.append("file1", selectedFile);
        payload = formData;
      } else {
        payload = {
          execution_date: executionDate,
          base: formDataValues.base,
          upturn: formDataValues.upTurn,
          downturn: formDataValues.downTurn,
        };
      }

      const response = await executeModel.mutateAsync(payload);

      cleanupProgress();
      completeProgress();
      toast.success(extractSuccessMessage(response));

      await queryClient.invalidateQueries({
        queryKey: ["execution-models"],
        exact: false,
      });

      setTimeout(() => setShowSuccess(true), 1500);
    } catch (error: unknown) {
      cleanupProgress();
      setUploadStep("error");

      const validationPayload = extractValidationPayload(error);

      if (validationPayload) {
        setValidationError(validationPayload);

        toastIdRef.current = toast.error("Validation failed", {
          description: "Your uploaded file contains validation issues",
          duration: Infinity,
        });

        return;
      }

      toast.error(extractErrorMessage(error));
    }
  };

  const renderExecutionDateField = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Execution Date
      </label>
      <div className="relative flex gap-2 mt-1 border border-[#e5e5e5] dark:border-neutral-800 dark:bg-transparent px-4 rounded-[8px] h-[48px] overflow-hidden items-center gap-x-4 focus-within:border-[#FDC316]">
        <input
          value={
            form.watch("execution_date")
              ? format(form.watch("execution_date"), "PPP")
              : ""
          }
          placeholder="Select execution date"
          className="pr-10 w-full h-full bg-transparent text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none"
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (isValidDate(date)) form.setValue("execution_date", date);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setDateOpen(true);
            }
          }}
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
              selected={form.watch("execution_date")}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (date) {
                  form.setValue("execution_date", date);
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
  );

  const renderFLIFields = () => (
    <div className="space-y-4">
      <CustomInputField
        name="base"
        label="Base(%)"
        control={form.control}
        min={0}
        fieldType={FormFieldType.NUMBER}
        placeholder="Enter base value"
        disabled={isUploading || executeModel.isPending}
      />
      <CustomInputField
        name="upTurn"
        label="Up Turn(%)"
        min={0}
        control={form.control}
        fieldType={FormFieldType.NUMBER}
        placeholder="Enter up Turn value"
        disabled={isUploading || executeModel.isPending}
      />
      <CustomInputField
        name="downTurn"
        label="Down Turn(%)"
        control={form.control}
        min={0}
        fieldType={FormFieldType.NUMBER}
        placeholder="Enter downTurn value"
        disabled={isUploading || executeModel.isPending}
      />
    </div>
  );

  const renderFileUploadSection = () => (
    <>
      {uploadStep === "initial" && !selectedFile && (
        <FileUploadArea onFileSelect={handleFileSelect} enableLink />
      )}

      {selectedFile && (
        <FileItem
          onViewErrorLog={displayErrorSheet}
          fileName={selectedFile.name}
          fileSize={formatFileSize(selectedFile.size)}
          status={uploadStep}
          progress={uploadProgress}
          onReplace={resetFileState}
          onRemove={resetFileState}
          showActions={uploadStep !== "uploading"}
          validationError={validationError}
        />
      )}
    </>
  );

  const renderActionButtons = () => {
    if (isUploading) {
      return (
        <CustomButton
          title="Cancel"
          onClick={resetFileState}
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-[1.25rem]"
        />
      );
    }

    const isFormValid = isPDModel
      ? selectedFile !== null
      : validateFLIForm(form.getValues());

    return (
      <CustomButton
        title={isFLIModel ? "Submit" : "Run Model"}
        onClick={form.handleSubmit(executeModelWithFile)}
        disabled={!isFormValid || executeModel.isPending}
        isLoading={executeModel.isPending}
        className="w-full  hover:bg-[#005A2E] rounded-[12px]"
      />
    );
  };

  const renderModalContent = () => {
    if (showSuccess) {
      return (
        <SuccessModal
          title="Execution Successful"
          description="Your model execution is successful. Please view in reporting"
          leftAction={{
            label: "Back to Dashboard",
            onClick: resetAllState,
          }}
          rightAction={{
            label: "View Reports",
            onClick: navigateToPDPage,
          }}
        />
      );
    }

    return (
      <div className="space-y-[1.5rem]">
        <Form {...form}>
          <form className="space-y-4">
            {!isFLIModel && renderExecutionDateField()}
            {isFLIModel && renderFLIFields()}
            {isPDModel && renderFileUploadSection()}
            <div className="space-y-2">{renderActionButtons()}</div>
          </form>
        </Form>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="mb-[2rem]">
          <h1 className="text-[1.4rem] font-bold text-gray-900 mb-[0.5rem]">
            PD and FLI Management
          </h1>
          <p className="text-base font-[600] text-[#5B5F5E]">
            Execute your preferred models in here
          </p>
        </div>
      </div>

      <div className="bg-[#F3F3F3] border border-[#E1E3E2] rounded-[1.25rem] md:p-[2rem] p-[1rem]">
        <div className="flex items-center flex-wrap gap-[0.75rem] justify-between mb-[1.5rem]">
          <p className="md:text-[0.9375rem] text-[0.75rem] text-[#5B5F5E] font-[600]">
            Run PD and FLI models here
          </p>
        </div>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-[1rem] mb-[2rem]">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              title={model.title}
              description={model.description}
              onClick={() => handleRunModel(model.type)}
            />
          ))}
        </div>
      </div>

      <CustomModal
        open={isModalOpen}
        bg="bg-[#FFFFFF]"
        setOpen={setIsModalOpen}
        title={
          !showSuccess
            ? `${isPDModel ? "Run PD Model" : "Provide FLI Details"}`
            : undefined
        }
        width="max-w-xl"
      >
        {renderModalContent()}
      </CustomModal>

      <ValidationErrorSheet
        errorSheetOpen={errorSheetOpen}
        setErrorSheetOpen={setErrorSheetOpen}
        validationError={validationError}
      />
    </div>
  );
};

export default ModelManagement;
