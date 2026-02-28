"use client";

import React from "react";
import CustomButton from "../ui/custom-button";
import { cn } from "@/lib/utils";
import SuccessIocn from "@/public/assets/icon/success-icon.svg";
import { CustomImage } from "../ui/custom-image";

export interface ActionButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

interface SuccessModalProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  leftAction?: ActionButtonProps;
  rightAction?: ActionButtonProps;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  icon = <CustomImage src={SuccessIocn} style="w-20 h-20 mb-4" />,
  title,
  description,
  leftAction,
  rightAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center sm:px-6 px-0">
      {icon}

      <h2 className="text-[18px] font-[700] text-[black] mb-2 ">{title}</h2>

      {description && (
        <p className="text-[15px] font-[500] text-[#5B5F5E] text-center mb-8">
          {description}
        </p>
      )}

      <div className="flex sm:gap-6 gap-3 w-full">
        {leftAction && (
          <CustomButton
            title={leftAction.label}
            onClick={leftAction.onClick}
            textClassName="text-[12px] font-[600] text-[#5B5F5E]"
            className={cn(
              "flex-1 rounded-[20px]  border bg-white",
              leftAction.className,
            )}
          />
        )}
        {rightAction && (
          <CustomButton
            title={rightAction.label}
            onClick={rightAction.onClick}
            isLoading={rightAction.isLoading}
            textClassName="text-[12px] font-[600]"
            className={cn(
              "flex-1 rounded-[20px] bg-[#006F37]",
              rightAction.className,
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
