/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface UseAssignModalOptions {
  invalidateKeys: string[][];
  onSuccess?: () => void;
  successMessage?: string;
  errorMessage?: string;
  validationMessage?: string;
}

export const useAssignModal = ({
  invalidateKeys,
  onSuccess,
  successMessage = "Operation successful",
  errorMessage = "Operation failed",
  validationMessage = "Please select an option",
}: UseAssignModalOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const queryClient = useQueryClient();

  const open = () => setIsOpen(true);

  const reset = () => {
    setIsOpen(false);
    setSelectedId("");
  };

  const submit = async (mutateFn: () => Promise<unknown>) => {
    if (!selectedId) {
      toast.error(validationMessage);
      return;
    }
    try {
      await mutateFn();
      toast.success(successMessage);
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || errorMessage);
    }
  };

  return { isOpen, setIsOpen, selectedId, setSelectedId, open, reset, submit };
};
