"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import SuccessModal from "@/components/shared/SuccessModal";
import CustomButton from "@/components/ui/custom-button";
import ModelCard from "./ModelCard";
import { CustomModal } from "@/components/ui/custom-modal";
import { Form } from "@/components/ui/form";
import ValidationErrorSheet from "@/components/shared/ValidationErrorSheet";

import { usePost } from "@/hooks/use-queries";
import { models } from "@/constants/model-management";
import { ApiResponse } from "@/types";
import {
  ExecutableModels,
  ModelManagementApiResponse,
} from "@/types/model-execution";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useUploadProgress } from "@/hooks/use-upload-progress";
import { extractValidationPayload } from "@/lib/parse-validation-error";
import type { ValidationErrorPayload } from "@/lib/parse-validation-error";

/* eslint-disable @typescript-eslint/no-explicit-any */

const FLIFormSchema = z.object({
  probability_scenarios: z.string().optional(),
  fli_scalar_mapping: z.string().optional(),
});

type FLIFormData = z.infer<typeof FLIFormSchema>;

const ModelManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState("");
  const [errorSheetOpen, setErrorSheetOpen] = useState(false);
  const [validationError, setValidationError] =
    useState<ValidationErrorPayload | null>(null);

  const toastIdRef = React.useRef<string | number | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { resetProgress } = useUploadProgress();

  const form = useForm<FLIFormData>({
    resolver: zodResolver(FLIFormSchema),
    defaultValues: {
      probability_scenarios: "",
      fli_scalar_mapping: "",
    },
  });

  const isFLIModel = selectedModelType === ExecutableModels.FLI;

  const executePDModel = usePost<
    ApiResponse<ModelManagementApiResponse>,
    undefined
  >("/guarantees/pd", ["execution-models"]);

  const executeFLIModel = usePost<ApiResponse<ModelManagementApiResponse>, any>(
    "/guarantees/fli",
    ["execution-models"],
  );

  const resetAllState = () => {
    setSelectedModelType("");
    resetProgress();
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

  const handleRunPDModel = async () => {
    setSelectedModelType(ExecutableModels.PD);
    try {
      const response = await executePDModel.mutateAsync(undefined);
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

  const handleRunFLIModel = () => {
    setSelectedModelType(ExecutableModels.FLI);
    setIsModalOpen(true);
    form.reset({ probability_scenarios: "", fli_scalar_mapping: "" });
  };

  const handleRunModel = (modelType: string) => {
    if (modelType === ExecutableModels.PD) {
      handleRunPDModel();
    } else {
      handleRunFLIModel();
    }
  };

  // Safely parse an optional JSON string field; returns undefined if empty
  const parseOptionalJSON = (value: string | undefined) => {
    if (!value || value.trim() === "") return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return value; // let server handle validation
    }
  };

  const executeFLIWithPayload = async (formValues: FLIFormData) => {
    try {
      const payload: Record<string, any> = {};

      const parsedScenarios = parseOptionalJSON(
        formValues.probability_scenarios,
      );
      const parsedMapping = parseOptionalJSON(formValues.fli_scalar_mapping);

      if (parsedScenarios !== undefined)
        payload.probability_scenarios = parsedScenarios;
      if (parsedMapping !== undefined)
        payload.fli_scalar_mapping = parsedMapping;

      const response = await executeFLIModel.mutateAsync(
        Object.keys(payload).length > 0 ? payload : undefined,
      );

      toast.success(extractSuccessMessage(response));

      await queryClient.invalidateQueries({
        queryKey: ["execution-models"],
        exact: false,
      });

      setTimeout(() => setShowSuccess(true), 1500);
    } catch (error: unknown) {
      const validationPayload = extractValidationPayload(error);

      if (validationPayload) {
        setValidationError(validationPayload);
        toastIdRef.current = toast.error("Validation failed", {
          description: "Your request contains validation issues",
          duration: Infinity,
        });
        return;
      }

      toast.error(extractErrorMessage(error));
    }
  };

  const renderFLIFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Probability Scenarios{" "}
          <span className="text-[#A3A3A3] font-normal">(Optional)</span>
        </label>
        <textarea
          {...form.register("probability_scenarios")}
          placeholder='e.g. {"scenario_1": 0.3, "scenario_2": 0.7}'
          rows={4}
          disabled={executeFLIModel.isPending}
          className="w-full border border-[#e5e5e5] dark:border-neutral-800 dark:bg-transparent px-4 py-3 rounded-[8px] text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none focus:border-[#FDC316] resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          FLI Scalar Mapping{" "}
          <span className="text-[#A3A3A3] font-normal">(Optional)</span>
        </label>
        <textarea
          {...form.register("fli_scalar_mapping")}
          placeholder='e.g. {"key": "value"}'
          rows={4}
          disabled={executeFLIModel.isPending}
          className="w-full border border-[#e5e5e5] dark:border-neutral-800 dark:bg-transparent px-4 py-3 rounded-[8px] text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none focus:border-[#FDC316] resize-none"
        />
      </div>
    </div>
  );

  const renderFLIActionButtons = () => (
    <CustomButton
      title="Submit"
      onClick={form.handleSubmit(executeFLIWithPayload)}
      disabled={executeFLIModel.isPending}
      isLoading={executeFLIModel.isPending}
      className="w-full hover:bg-[#005A2E] rounded-[12px]"
    />
  );

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

    // Only FLI opens a modal with fields
    if (isFLIModel) {
      return (
        <div className="space-y-[1.5rem]">
          <Form {...form}>
            <form className="space-y-4">
              {renderFLIFields()}
              <div className="space-y-2">{renderFLIActionButtons()}</div>
            </form>
          </Form>
        </div>
      );
    }

    return null;
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
                model.type === ExecutableModels.PD && executePDModel.isPending
              }
            />
          ))}
        </div>
      </div>

      {/* FLI modal + PD success modal */}
      <CustomModal
        open={isModalOpen}
        bg="bg-[#FFFFFF]"
        setOpen={(open) => {
          if (!open) resetAllState();
          else setIsModalOpen(true);
        }}
        title={!showSuccess ? "Provide FLI Details" : undefined}
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
