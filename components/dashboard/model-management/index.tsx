"use client";

import React, { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import SuccessModal from "@/components/shared/SuccessModal";
import ModelCard from "./ModelCard";
import { CustomModal } from "@/components/ui/custom-modal";

import { usePost } from "@/hooks/use-queries";
import { models } from "@/constants/model-management";
import { ApiResponse } from "@/types";
import {
  ExecutableModels,
  ModelManagementApiResponse,
} from "@/types/model-execution";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

const ModelManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const executePDModel = usePost<
    ApiResponse<ModelManagementApiResponse>,
    undefined
  >("/guarantees/pd", ["execution-models"]);

  const executeFLIModel = usePost<
    ApiResponse<ModelManagementApiResponse>,
    undefined
  >("/guarantees/fli", ["execution-models"]);

  const resetAllState = () => {
    setShowSuccess(false);
    setIsModalOpen(false);
  };

  const navigateToPDPage = () => {
    resetAllState();
    router.push("/dashboard/reporting/");
  };

  const handleRunModel = async (modelType: string) => {
    try {
      const mutation =
        modelType === ExecutableModels.PD ? executePDModel : executeFLIModel;

      const response = await mutation.mutateAsync(undefined);
      toast.success(extractSuccessMessage(response));
      await queryClient.invalidateQueries({
        queryKey: ["execution-models"],
        exact: false,
      });
      setShowSuccess(true);
      setIsModalOpen(true);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
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
              isLoading={
                (model.type === ExecutableModels.PD &&
                  executePDModel.isPending) ||
                (model.type === ExecutableModels.FLI &&
                  executeFLIModel.isPending)
              }
            />
          ))}
        </div>
      </div>

      <CustomModal
        open={isModalOpen}
        bg="bg-[#FFFFFF]"
        setOpen={(open) => {
          if (!open) resetAllState();
          else setIsModalOpen(true);
        }}
        width="max-w-xl"
      >
        {showSuccess && (
          <SuccessModal
            title="Execution Successful"
            description="Your model execution is successful. Please view in reporting"
            leftAction={{ label: "Back to Dashboard", onClick: resetAllState }}
            rightAction={{ label: "View Reports", onClick: navigateToPDPage }}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default ModelManagement;
