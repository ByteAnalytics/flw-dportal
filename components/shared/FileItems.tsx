"use client";

import React from "react";
import { FileText, Trash2, Check, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ValidationErrorPayload } from "@/lib/parse-validation-error";

interface FileItemProps {
  fileName: string;
  fileSize: string;
  status: "idle" | "uploading" | "success" | "error" | "initial";
  progress?: number;
  onRemove?: () => void;
  onReplace?: () => void;
  onDownload?: () => void;
  onViewErrorLog?: () => void;
  errorMessage?: string;
  showActions?: boolean;
  validationError: ValidationErrorPayload | null;
}

export const FileItem: React.FC<FileItemProps> = ({
  fileName,
  fileSize,
  status,
  progress = 0,
  onRemove,
  onReplace,
  onDownload,
  onViewErrorLog,
  errorMessage,
  showActions = true,
  validationError,
}) => {
  const isError = status === "error";
  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-colors",
        isError ? "border-red-300 bg-red-50" : "border-gray-200 bg-white",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div
            className={cn("p-2 rounded", isError ? "bg-red-100" : "bg-gray-50")}
          >
            <FileText
              className={cn(
                "w-5 h-5",
                isError ? "text-red-600" : "text-gray-600",
              )}
            />
          </div>

          <div className="flex-1">
            <p
              className={cn(
                "text-sm font-medium truncate w-34",
                isError ? "text-red-900" : "text-[#003A1B]",
              )}
            >
              {fileName}
            </p>
            <p className="text-xs text-gray-500">{fileSize}</p>
            {validationError && (
              <button
                type="button"
                onClick={onViewErrorLog}
                className="text-sm mt-2 text-[#006D37] font-medium hover:underline flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                View full error Log
              </button>
            )}

            {status === "uploading" && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    {status === "uploading" ? "Model Running" : "Uploading..."}
                  </span>
                  <span className="text-xs font-medium text-[#006D37]">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#006D37] h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {isError && errorMessage && (
              <div>
                <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
                <button
                  type="button"
                  onClick={onReplace}
                  className="text-xs text-red-600 rounded-[20px] underline mt-1 hover:text-red-700"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "success" && (
            <div className="p-1.5 bg-[#006D37] rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}

          {showActions && (
            <>
              {status === "idle" && onReplace && (
                <button
                  type="button"
                  onClick={onReplace}
                  className="text-sm text-[#006D37] font-medium hover:underline"
                >
                  Replace File
                </button>
              )}

              {status === "success" && onDownload && (
                <button
                  type="button"
                  onClick={onDownload}
                  className="text-sm text-[#006D37] font-medium hover:underline flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Click to download sample
                </button>
              )}

              {onRemove && status !== "uploading" && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
