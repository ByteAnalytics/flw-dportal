import { useState } from "react";

type FileUploadStep = "initial" | "idle" | "uploading" | "success" | "error";

export const useUploadProgress = () => {
  const [uploadStep, setUploadStep] = useState<FileUploadStep>("initial");
  const [uploadProgress, setUploadProgress] = useState(0);

  const startProgress = () => {
    setUploadStep("uploading");
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(progressInterval);
  };

  const completeProgress = () => {
    setUploadProgress(100);
    setUploadStep("success");
  };

  const resetProgress = () => {
    setUploadStep("initial");
    setUploadProgress(0);
  };

  return {
    uploadStep,
    uploadProgress,
    startProgress,
    completeProgress,
    resetProgress,
    setUploadStep,
    isUploading: uploadStep === "uploading",
  };
};
