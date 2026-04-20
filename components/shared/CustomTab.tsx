"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  headerRight?: React.ReactNode;
}

export function CustomTabs({
  defaultValue,
  options,
  onValueChange,
  className,
  tabsListClassName,
  triggerClassName,
  contentClassName,
  headerRight,
}: CustomTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  const TabListComponent = (
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
  );

  const activeContent = options.find((o) => o.value === activeTab)?.content;

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleValueChange}
      className={cn("w-full", className)}
    >
      {headerRight ? (
        <div className="flex justify-between items-center w-full flex-wrap gap-3">
          {TabListComponent}
          <div className="ms-auto">{headerRight}</div>
        </div>
      ) : (
        TabListComponent
      )}

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn("mt-3", contentClassName)}
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
