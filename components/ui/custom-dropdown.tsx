"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
  subItems?: DropdownItem[]; // allows nested dropdown
}

interface CustomDropdownProps {
  trigger: React.ReactNode; // e.g. a button or icon
  items: DropdownItem[];
  className?: string;
  label?: string;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  trigger,
  items,
  className,
  label,
  disabled = false,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-[145px]", className)}>
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {items.map((item, i) => {
          if (item.separator) return <DropdownMenuSeparator key={i} />;

          if (item.subItems && item.subItems.length > 0) {
            return (
              <DropdownMenuSub key={i}>
                <DropdownMenuSubTrigger>
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {item.subItems.map((sub, j) =>
                    sub.separator ? (
                      <DropdownMenuSeparator key={j} />
                    ) : (
                      <DropdownMenuItem
                        key={j}
                        onClick={sub.onClick}
                        disabled={sub.disabled}
                      >
                        {sub.icon && <span className="mr-2">{sub.icon}</span>}
                        {sub.label}
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          }

          return (
            <DropdownMenuItem
              key={i}
              onClick={item.onClick}
              disabled={item.disabled}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default React.memo(CustomDropdown);
