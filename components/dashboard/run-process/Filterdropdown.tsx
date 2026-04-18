"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { Button } from "@/components/ui/button";

interface FilterDropdownProps {
  label: string;
  items: DropdownItem[];
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  items,
}) => (
  <CustomDropdown
    trigger={
      <Button
        variant="outline"
        className="h-[40px] bg-white flex items-center gap-2 text-gray-500 font-semibold text-[13px] max-w-[200px] w-full justify-between border-InfraBorder"
      >
        {label}
        <ChevronDown className="w-4 h-4" />
      </Button>
    }
    items={items}
  />
);
