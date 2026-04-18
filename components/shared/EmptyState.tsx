import React from "react";
import CustomButton from "@/components/ui/custom-button";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  actionLabel,
  onAction,
}) => (
  <div className="text-center py-8 bg-[#F9FAFB] rounded-[12px] border border-[#E5E7EB] flex flex-col items-center gap-4">
    <p className="text-[13px] text-[#9CA3AF]">{message}</p>
    {actionLabel && onAction && (
      <CustomButton
        title={actionLabel}
        onClick={onAction}
        textClassName="md:text-[13px] text-[12px] font-[700] text-white"
        className="min-w-[140px] rounded-[12px] border md:h-[43px] h-[41px]"
      />
    )}
  </div>
);

export default EmptyState;
