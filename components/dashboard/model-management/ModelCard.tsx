"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StatIcon } from "@/svg";
import CustomButton from "@/components/ui/custom-button";

interface ModelCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const ModelCard: React.FC<ModelCardProps> = ({
  title,
  description,
  onClick,
  className,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        "w-full p-6 bg-white rounded-[20px] text-left transition-all border border-transparent",
        " hover:shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col h-full items-start gap-3">
        {/* Icon */}
        <StatIcon />

        <div className=" flex flex-col justify-between h-full">
          <div>
            <h3 className="text-[13px] md:text-[15px] font-semibold mb-3">
              {title}
            </h3>
            <p className="text-[12px] text-[#425563] font-normal leading-relaxed mb-4">
              {description}
            </p>
          </div>

          <div>
            <CustomButton
              title="Run Model"
              onClick={onClick}
              isLoading={isLoading}
              disabled={disabled}
              className="mt-auto min-w-[96px] rounded-[8px] !h-[37px]"
              textClassName="!text-[14px] font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
