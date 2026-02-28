"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StatIcon } from "@/svg";
import { CustomImage } from "@/components/ui/custom-image";
import thick from "@/public/thick.png";

interface ModelCardProps {
  title: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({
  title,
  description,
  isSelected = false,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full p-[1.5rem] rounded-[1.25rem] transition-all text-left relative border cursor-pointer",
        "hover:border-InfraBlue hover:shadow-sm",
        isSelected
          ? "border-InfraBlue bg-[#F6F8FC]"
          : "bg-white",
        className,
      )}
    >
      {  isSelected &&<CustomImage src={thick} alt="Selected" style="absolute top-0 right-0 w-[40px] h-[40px]" />}
      <div className="flex flex-col items-start gap-[0.75rem] lg:w-[60%] w-full">
        <div
          className={cn(
            "p-[0.5rem] rounded-[4px]",
            isSelected ? "bg-[#CAEAD4]" : "bg-gray-50",
          )}
        >
          <StatIcon />
        </div>
        <div className="flex-1">
          <h3 className="md:text-[0.9375rem] text-[0.8125rem] font-[600] mb-[0.75rem]">
            {title}
          </h3>
          <p className="text-[12px] font-[400] text-[#425563] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
