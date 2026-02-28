"use client";

import React, { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

import CustomButton from "@/components/ui/custom-button";
import ModelCard from "./ModelCard";
import { FileSheet } from "./FileSheet";
import {
  ExecutionProgressModal,
  ModelExecutionState,
} from "./ExecutionProgressModal";
import { Checkbox } from "@/components/ui/checkbox";
import ValidationErrorSheet from "@/components/shared/ValidationErrorSheet";

import { usePost } from "@/hooks/use-queries";
import { useUploadProgress } from "@/hooks/use-upload-progress";
import { models } from "@/constants/model-execution";
import { ApiResponse } from "@/types";
import {
  ExecutableModels,
  ModelManagementApiResponse,
} from "@/types/model-execution";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { extractValidationPayload } from "@/lib/parse-validation-error";
import type { ValidationErrorPayload } from "@/lib/parse-validation-error";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ModelExecution = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const [isFileSheetOpen, setIsFileSheetOpen] = useState(false);
  const [selectedModelFiles, setSelectedModelFiles] = useState<
    Record<string, File | null>
  >({});
  const [executionDate, setExecutionDate] = useState<Date>(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [executionState, setExecutionState] = useState<ModelExecutionState>({
    status: "idle",
    progress: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const [errorSheetOpen, setErrorSheetOpen] = useState(false);
  const [validationError, setValidationError] =
    useState<ValidationErrorPayload | null>(null);

  const toastIdRef = React.useRef<string | number | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { startProgress, completeProgress, resetProgress, setUploadStep } =
    useUploadProgress();

  const executeModel = usePost<
    ApiResponse<ModelManagementApiResponse>,
    FormData
  >(`/models/all_model_run`, ["execution-models"]);

  const toggleModelSelection = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleCheckboxChange = () => {
    if (selectedModels.length === models.length) {
      setSelectedModels([]);
    } else {
      setSelectedModels(models.map((m) => m.id));
    }
  };

  const handleOpenFileSheet = () => {
    if (selectedModels.length === 0) {
      toast.error("Please select at least one model");
      return;
    }
    setIsFileSheetOpen(true);
  };

  const displayErrorSheet = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    setErrorSheetOpen(true);
  };

  const resetAllState = () => {
    setSelectedModels([]);
    setSelectedModelFiles({});
    setExecutionDate(new Date());
    setIsFileSheetOpen(false);
    setIsModalOpen(false);
    setExecutionState({ status: "idle", progress: 0 });
    setShowSuccess(false);
    setValidationError(null);
    setErrorSheetOpen(false);
    resetProgress();
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  const runAllModels = async () => {
    const dateStr = format(executionDate, "yyyy-MM-dd");

    setExecutionState({ status: "uploading", progress: 10 });
    const cleanupProgress = startProgress();

    try {
      const formData = new FormData();
      formData.append("execution_date", dateStr);

      let fileIndex = 1;
      models
        .filter((m) => selectedModels.includes(m.id))
        .forEach((model) => {
          const file = selectedModelFiles[model.id];
          if (file) {
            formData.append(`file${fileIndex}`, file);
            formData.append(`execution_model_type`, model.id.toUpperCase());
            fileIndex++;
          }
        });

      setExecutionState({ status: "uploading", progress: 50 });

      const response = await executeModel.mutateAsync(formData);

      cleanupProgress();
      completeProgress();

      setExecutionState({ status: "success", progress: 100 });

      toast.success(extractSuccessMessage(response));

      await queryClient.invalidateQueries({
        queryKey: ["execution-models"],
        exact: false,
        refetchType: "active",
      });

      setTimeout(() => setShowSuccess(true), 1500);
    } catch (error: unknown) {
      cleanupProgress();
      setUploadStep("error");

      const validationPayload = extractValidationPayload(error);

      if (validationPayload) {
        setValidationError(validationPayload);
        setExecutionState({
          status: "error",
          progress: 0,
          errorMessage: "Validation failed",
        });

        toastIdRef.current = toast.error("Validation failed", {
          description: "Your uploaded file contains validation issues",
          duration: Infinity,
        });

        return;
      }

      setExecutionState({
        status: "error",
        progress: 0,
        errorMessage: extractErrorMessage(error),
      });

      toast.error(extractErrorMessage(error));
    }
  };

  const handleSheetSubmit = () => {
    setIsFileSheetOpen(false);
    setIsModalOpen(true);
    setTimeout(() => {
      runAllModels();
    }, 300);
  };

  const navigateToReporting = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["execution-models"],
      exact: false,
    });
    resetAllState();
    router.push("/dashboard/reporting/");
  };

  return (
    <div>
      <div className="mb-[2rem]">
        <h1 className="text-[1.4rem] font-bold text-gray-900 mb-[0.5rem]">
          Model Execution
        </h1>
        <p className="text-base text-[#5B5F5E] font-[600]">
          Run your models simultaneously
        </p>
      </div>

      <div className="bg-[#F3F3F3] border border-[#E1E3E2] rounded-[1.25rem] md:p-[2rem] p-[1rem]">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-[1rem] mb-[2rem]">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              title={model.title}
              description={model.description}
              isSelected={selectedModels.includes(model.id)}
              onClick={() => toggleModelSelection(model.id)}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex gap-2 items-center">
            <Checkbox
              checked={selectedModels.length === models.length}
              onCheckedChange={handleCheckboxChange}
            />
            <span className="text-sm text-gray-700">
              Run all models at once
            </span>
          </div>
          <CustomButton
            title={`Run Models (${selectedModels.length})`}
            onClick={handleOpenFileSheet}
            disabled={selectedModels.length === 0}
            textClassName="!text-[0.875rem] font-[600]"
            className="min-w-[170px] rounded-[8px] !h-[45px]"
          />
        </div>
      </div>

      <FileSheet
        isOpen={isFileSheetOpen}
        setIsOpen={setIsFileSheetOpen}
        selectedModels={selectedModels}
        selectedModelFiles={selectedModelFiles}
        setSelectedModelFiles={setSelectedModelFiles}
        executionDate={executionDate}
        setExecutionDate={setExecutionDate}
        onSubmit={handleSheetSubmit}
      />

      <ExecutionProgressModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectedModels={selectedModels}
        selectedModelFiles={selectedModelFiles}
        executionState={executionState}
        showSuccess={showSuccess}
        onCancel={resetAllState}
        onBackToDashboard={resetAllState}
        onViewReports={navigateToReporting}
        onViewErrorLog={displayErrorSheet}
        validationError={validationError}
      />

      <ValidationErrorSheet
        errorSheetOpen={errorSheetOpen}
        setErrorSheetOpen={setErrorSheetOpen}
        validationError={validationError}
      />
    </div>
  );
};

export default ModelExecution;
