"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

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
  ThreeFileSet,
} from "@/types/model-execution";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { extractValidationPayload } from "@/lib/parse-validation-error";
import type { ValidationErrorPayload } from "@/lib/parse-validation-error";
import { ModelFormData, defaultModelFormData } from "@/types/model-execution";

/* eslint-disable @typescript-eslint/no-explicit-any */

const defaultSharedFileData = (): ThreeFileSet => ({
  exposure_date: new Date(),
  amortization_file: null,
  asset_information_file: null,
  collateral_file: null,
});

const ModelExecution = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isFileSheetOpen, setIsFileSheetOpen] = useState(false);
  const [modelFormData, setModelFormData] = useState<ModelFormData>(
    defaultModelFormData(),
  );
  const [sharedFileData, setSharedFileData] = useState<ThreeFileSet>(
    defaultSharedFileData(),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [executionState, setExecutionState] = useState<ModelExecutionState>({
    status: "idle",
    progress: 0,
  });
  const [perModelState, setPerModelState] = useState<
    Record<string, ModelExecutionState>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorSheetOpen, setErrorSheetOpen] = useState(false);
  const [validationError, setValidationError] =
    useState<ValidationErrorPayload | null>(null);

  const toastIdRef = React.useRef<string | number | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { startProgress, completeProgress, resetProgress, setUploadStep } =
    useUploadProgress();

  const executeLGD = usePost<ApiResponse<ModelManagementApiResponse>, any>(
    `/guarantees/lgd`,
    ["execution-models"],
  );
  const executeEAD = usePost<ApiResponse<ModelManagementApiResponse>, any>(
    `/guarantees/ead`,
    ["execution-models"],
  );
  const executeECL = usePost<ApiResponse<ModelManagementApiResponse>, any>(
    `/guarantees/ecl`,
    ["execution-models"],
  );
  const executeCCF = usePost<ApiResponse<ModelManagementApiResponse>, any>(
    `/guarantees/ccf`,
    ["execution-models"],
  );

  const getExecutorForModel = (modelId: string) => {
    const mid = modelId?.toLowerCase();
    if (ExecutableModels.LGD.startsWith(mid)) return executeLGD;
    if (ExecutableModels.EAD.startsWith(mid)) return executeEAD;
    if (ExecutableModels.ECL.startsWith(mid)) return executeECL;
    if (ExecutableModels.CCF.startsWith(mid)) return executeCCF;
    return executeLGD;
  };

  const buildPayload = (): FormData => {
    const fd = new FormData();
    fd.append(
      "exposure_date",
      format(sharedFileData.exposure_date, "yyyy-MM-dd"),
    );
    if (sharedFileData.amortization_file)
      fd.append("amortization_file", sharedFileData.amortization_file);
    if (sharedFileData.asset_information_file)
      fd.append(
        "asset_information_file",
        sharedFileData.asset_information_file,
      );
    if (sharedFileData.collateral_file)
      fd.append("collateral_file", sharedFileData.collateral_file);
    return fd;
  };

  const toggleModelSelection = useCallback((id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }, []);

  const handleCheckboxChange = () => {
    setSelectedModels(
      selectedModels.length === models.length ? [] : models.map((m) => m.id),
    );
  };

  const handleOpenFileSheet = useCallback(() => {
    if (selectedModels.length === 0) {
      toast.error("Please select at least one model");
      return;
    }
    setIsFileSheetOpen(true);
  }, [selectedModels]);

  const displayErrorSheet = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    setErrorSheetOpen(true);
  };

  const resetAllState = useCallback(() => {
    setSelectedModels([]);
    setModelFormData(defaultModelFormData());
    setSharedFileData(defaultSharedFileData());
    setIsFileSheetOpen(false);
    setIsModalOpen(false);
    setExecutionState({ status: "idle", progress: 0 });
    setPerModelState({});
    setShowSuccess(false);
    setValidationError(null);
    setErrorSheetOpen(false);
    resetProgress();
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [resetProgress]);

  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open);
    if (!open && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  const runAllModels = useCallback(async () => {
    setExecutionState({ status: "uploading", progress: 10 });
    const cleanupProgress = startProgress();

    const initialPerModelState: Record<string, ModelExecutionState> = {};
    selectedModels.forEach((id) => {
      initialPerModelState[id] = { status: "uploading", progress: 10 };
    });
    setPerModelState(initialPerModelState);

    const progressStep = Math.floor(80 / selectedModels.length);
    let currentProgress = 10;
    let hasAnyFailure = false;

    for (const modelId of selectedModels) {
      const executor = getExecutorForModel(modelId);
      const payload = buildPayload();

      currentProgress += progressStep;
      setExecutionState({ status: "uploading", progress: currentProgress });

      try {
        const response = await executor.mutateAsync(payload);
        setPerModelState((prev) => ({
          ...prev,
          [modelId]: { status: "success", progress: 100 },
        }));
        toast.success(
          `${modelId.toUpperCase()}: ${extractSuccessMessage(response)}`,
        );
      } catch (error: unknown) {
        hasAnyFailure = true;
        setUploadStep("error");

        const validationPayload = extractValidationPayload(error);

        if (validationPayload) {
          setValidationError((prev) => prev ?? validationPayload);
          setPerModelState((prev) => ({
            ...prev,
            [modelId]: {
              status: "error",
              progress: 0,
              errorMessage: "Validation failed",
            },
          }));
          toastIdRef.current = toast.error(
            `${modelId.toUpperCase()}: Validation failed`,
            {
              description: "Your uploaded file contains validation issues",
              duration: Infinity,
            },
          );
        } else {
          setPerModelState((prev) => ({
            ...prev,
            [modelId]: {
              status: "error",
              progress: 0,
              errorMessage: extractErrorMessage(error),
            },
          }));
          toastIdRef.current = toast.error(
            `${modelId.toUpperCase()}: ${extractErrorMessage(error)}`,
            {
              duration: Infinity,
            },
          );
        }
      }
    }

    cleanupProgress();

    if (hasAnyFailure) {
      completeProgress();
      setExecutionState({ status: "error", progress: currentProgress });
    } else {
      completeProgress();
      setExecutionState({ status: "success", progress: 100 });
      await queryClient.invalidateQueries({
        queryKey: ["execution-models"],
        exact: false,
        refetchType: "active",
      });
      setTimeout(() => setShowSuccess(true), 1500);
    }
  }, [selectedModels, sharedFileData]);

  const handleSheetSubmit = useCallback(() => {
    setIsFileSheetOpen(false);
    setIsModalOpen(true);
    setTimeout(runAllModels, 300);
  }, [runAllModels]);

  const navigateToReporting = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["execution-models"],
      exact: false,
    });
    resetAllState();
    router.push("/dashboard/reporting/");
  };

  const selectedModelFiles: Record<string, File | null> = {};
  selectedModels.forEach((id) => {
    selectedModelFiles[id] = sharedFileData.amortization_file;
  });

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
        modelFormData={modelFormData}
        setModelFormData={setModelFormData}
        sharedFileData={sharedFileData}
        setSharedFileData={setSharedFileData}
        onSubmit={handleSheetSubmit}
      />

      <ExecutionProgressModal
        isOpen={isModalOpen}
        setIsOpen={handleModalOpenChange}
        selectedModels={selectedModels}
        selectedModelFiles={selectedModelFiles}
        executionState={executionState}
        perModelState={perModelState}
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
