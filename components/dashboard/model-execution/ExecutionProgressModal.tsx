"use client";

import React from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import SuccessModal from "@/components/shared/SuccessModal";
import CustomButton from "@/components/ui/custom-button";
import { FileItem } from "@/components/shared/FileItems";
import { formatFileSize } from "@/lib/utils";
import { models } from "@/constants/model-execution";
import { extractModelType } from "@/lib/model-execution-utils";

export type ModelExecutionStatus =
  | "idle"
  | "uploading"
  | "success"
  | "error"
  | "initial";

export interface ModelExecutionState {
  status: ModelExecutionStatus;
  progress: number;
  errorMessage?: string;
}

interface ExecutionProgressModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedModels: string[];
  selectedModelFiles: Record<string, File | null>;
  executionState: ModelExecutionState;
  showSuccess: boolean;
  onCancel: () => void;
  onBackToDashboard: () => void;
  onViewReports: () => void;
  onViewErrorLog?: () => void;
  validationError:
    | import("@/lib/parse-validation-error").ValidationErrorPayload
    | null;
}

export const ExecutionProgressModal: React.FC<ExecutionProgressModalProps> = ({
  isOpen,
  setIsOpen,
  selectedModels,
  selectedModelFiles,
  executionState,
  showSuccess,
  onCancel,
  onBackToDashboard,
  onViewReports,
  onViewErrorLog,
  validationError,
}) => {
  const filteredModels = models.filter((m) => selectedModels.includes(m.id));

  // Get the first file to display (since all models share the same files)
  const firstModel = filteredModels[0];
  const sharedFile = firstModel ? selectedModelFiles[firstModel.id] : null;

  // Format model names for display
  const modelNames = filteredModels
    .map((m) => extractModelType(m.id).toUpperCase())
    .join(", ");

  const isRunning = executionState.status === "uploading";
  const hasError = executionState.status === "error";

  const renderContent = () => {
    if (showSuccess) {
      return (
        <SuccessModal
          title="Execution Successful"
          description="Your model execution is successful. Please view in reporting"
          leftAction={{
            label: "Back to Dashboard",
            onClick: onBackToDashboard,
          }}
          rightAction={{ label: "View Reports", onClick: onViewReports }}
        />
      );
    }

    return (
      <div className="space-y-[1.5rem]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-[600] text-[#5B5F5E] uppercase tracking-wide">
              Executing Models: {modelNames}
            </p>
            {sharedFile && (
              <FileItem
                fileName={sharedFile.name}
                fileSize={formatFileSize(sharedFile.size)}
                status={executionState.status}
                progress={executionState.progress}
                onRemove={!isRunning ? onCancel : undefined}
                onReplace={!isRunning ? onCancel : undefined}
                onViewErrorLog={hasError ? onViewErrorLog : undefined}
                showActions={!isRunning}
                validationError={hasError ? validationError : null}
              />
            )}
          </div>
        </div>

        {isRunning ? (
          <CustomButton
            title="Cancel"
            onClick={onCancel}
            textClassName="!text-[0.875rem] font-[600]"
            className="w-full border-red-300 text-red-600 bg-red-50 rounded-[1.25rem]"
          />
        ) : hasError ? (
          <CustomButton
            title="Dismiss"
            onClick={onCancel}
            textClassName="!text-[0.875rem] font-[600]"
            className="w-full rounded-[1.25rem] bg-gray-100 text-gray-700"
          />
        ) : null}
      </div>
    );
  };

  return (
    <CustomModal
      open={isOpen}
      bg="bg-[#FFFFFF]"
      setOpen={(val) => {
        if (!isRunning) setIsOpen(val);
        if (!val && !isRunning) onCancel();
      }}
      title={!showSuccess ? "Run Model Execution" : undefined}
      width="max-w-xl"
    >
      {renderContent()}
    </CustomModal>
  );
};
