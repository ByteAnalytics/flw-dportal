import React from "react";
import { Plus } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";

interface TabHeaderProps {
  title: string;
  count: number;
  actionLabel: string;
  onAction: () => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  count,
  actionLabel,
  onAction,
}) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[14px] font-[600] text-[#111827]">
      {title} ({count})
    </h3>
    <CustomButton
      title={actionLabel}
      onClick={onAction}
      textClassName="!text-[12px] font-[600] text-[#3B82F6]"
      className="rounded-[8px] bg-transparent hover:bg-[#EFF6FF] h-[32px]"
      iconPosition="left"
      withSideIcon
      sideIcon={<Plus size={14} />}
    />
  </div>
);

export default TabHeader;
