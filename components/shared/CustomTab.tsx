"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs,TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CustomTabsProps {
  defaultValue: string;
  options: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
  onValueChange?: (value: string) => void;
  className?: string;
  tabsListClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function CustomTabs({
  defaultValue,
  options,
  onValueChange,
  className,
  tabsListClassName,
  triggerClassName,
  contentClassName,
}: CustomTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className={cn("w-full", className)}
    >
      {/* --- Tabs Header --- */}
      <TabsList
        className={cn(
          "w-full md:gap-8 gap-4 bg-transparent custom-scroll justify-between flex p-[2px] rounded-none h-auto overflow-auto max-w-full md:max-w-fit border-b-2 border-InfraBorder",
          tabsListClassName,
        )}
      >
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className={cn(
              "!w-fit px-[12px] py-[8px] !md:text-[14px] !text-[12px] !font-[700] !shadow-none h-[38px]",
              "rounded-none bg-transparent border-b-3",
              "border-b-transparent",
              // active — blue bottom border
              "data-[state=active]:bg-transparent data-[state=active]:!border-b-InfraBlue",
              "data-[state=active]:text-InfraBlack data-[state=inactive]:text-InfraMuted",
              "transition-colors focus-visible:outline-none focus-visible:ring-0",
              triggerClassName,
            )}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* --- Animated Tab Content --- */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {options.map(
            (option) =>
              activeTab === option.value && (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn("mt-3", contentClassName)}
                >
                  {option.content}
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
