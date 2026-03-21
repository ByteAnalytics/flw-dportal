"use client";

import React from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import SuccessModal from "@/components/shared/SuccessModal";
import CustomButton from "@/components/ui/custom-button";
import { FileItem } from "@/components/shared/FileItems";
import { models } from "@/constants/model-execution";
import { formatFileSize } from "@/lib/utils";

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
  // ✅ Each model's independent state
  perModelState: Record<string, ModelExecutionState>;
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
  perModelState,
  showSuccess,
  onCancel,
  onBackToDashboard,
  onViewReports,
  onViewErrorLog,
  validationError,
}) => {
  const filteredModels = models.filter((m) => selectedModels.includes(m.id));

  // ✅ Only block closing/cancelling while at least one model is still in flight
  const isRunning = executionState.status === "uploading";

  // ✅ True only if every model that has settled came back as success
  const hasAnyError = Object.values(perModelState).some(
    (s) => s.status === "error",
  );

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
          {filteredModels.map((model) => {
            const file = selectedModelFiles[model.id];
            if (!file) return null;
            const modelState = perModelState[model.id] ?? executionState;

            return (
              <div key={model.id} className="flex flex-col gap-1">
                <p className="text-xs font-[600] text-[#5B5F5E] uppercase tracking-wide">
                  {model.title}
                </p>
                <FileItem
                  fileName={file.name}
                  fileSize={formatFileSize(file.size)}
                  status={modelState.status}
                  progress={modelState.progress}
                  onRemove={!isRunning ? onCancel : undefined}
                  onReplace={!isRunning ? onCancel : undefined}
                  onViewErrorLog={
                    modelState.status === "error" ? onViewErrorLog : undefined
                  }
                  showActions={!isRunning}
                  validationError={
                    modelState.status === "error" ? validationError : null
                  }
                />
              </div>
            );
          })}
        </div>

        {isRunning ? (
          <CustomButton
            title="Cancel"
            onClick={onCancel}
            textClassName="!text-[0.875rem] font-[600]"
            className="w-full border-red-300 text-red-600 bg-red-50 rounded-[1.25rem]"
          />
        ) : hasAnyError ? (
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
