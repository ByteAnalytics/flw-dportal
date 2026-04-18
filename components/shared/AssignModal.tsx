import React from "react";
import AlertModal from "@/components/shared/AlertModal";
import CustomButton from "@/components/ui/custom-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SelectOption {
  value: string;
  label: string;
}

interface AssignModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  description: string;
  isLoading: boolean;
  isPending: boolean;
  options: SelectOption[];
  selectedValue: string;
  onSelectChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  emptyMessage?: string;
}

const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  setIsOpen,
  description,
  isLoading,
  isPending,
  options,
  selectedValue,
  onSelectChange,
  onConfirm,
  onCancel,
  confirmLabel,
  emptyMessage = "No available options.",
}) => (
  <AlertModal isOpen={isOpen} setIsOpen={setIsOpen} description={description}>
    <div className="mt-4">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      ) : options.length === 0 ? (
        <p className="text-[13px] text-[#9CA3AF] text-center py-4">
          {emptyMessage}
        </p>
      ) : (
        <select
          value={selectedValue}
          onChange={(e) => onSelectChange(e.target.value)}
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-[13px]"
        >
          <option value="">Select an option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
    <div className="flex justify-between gap-3 mt-6 w-full">
      <CustomButton
        title="Cancel"
        onClick={onCancel}
        textClassName="!text-[13px] font-[600] text-[#374151]"
        className="rounded-[8px] border border-[#E5E7EB] bg-white hover:bg-gray-50 min-w-[80px] h-[40px]"
      />
      <CustomButton
        title={confirmLabel}
        onClick={onConfirm}
        isLoading={isPending}
        textClassName="!text-[13px] font-[700] text-white"
        className="rounded-[12px] border min-w-[100px] h-[40px]"
      />
    </div>
  </AlertModal>
);

export default AssignModal;
