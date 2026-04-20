"use client";

import React, { useState } from "react";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import CustomButton from "@/components/ui/custom-button";
import { useApiIntegrations } from "@/hooks/use-settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AddIntegrationSheet from "./AddIntegrationSheet";
import ApiIntegrationCard from "./ApiIntegrationCard";

const ApiIntegrationsTab = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data, isLoading } = useApiIntegrations();

  const integrations = data?.data ?? [];
  const activeCount = integrations.filter((i) => i.status === "active").length;
  const inactiveCount = integrations.filter(
    (i) => i.status === "inactive",
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-[18px] font-[700] text-[#111827]">
            API Integrations
          </h3>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Control which external services are available to your processes and
            teams
          </p>
        </div>

        <SheetWrapper
          open={isSheetOpen}
          title="Add Integration"
          description="Connect a new external service to your processes and teams."
          setOpen={setIsSheetOpen}
          trigger={
            <CustomButton
              onClick={() => setIsSheetOpen(true)}
              title="+ Add Integration"
              textClassName="md:text-[13px] text-[12px] font-[700] text-white"
              className="min-w-[150px] rounded-[12px] border md:h-[43px] h-[41px]"
            />
          }
        >
          <AddIntegrationSheet onClose={() => setIsSheetOpen(false)} />
        </SheetWrapper>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-6 text-[13px] font-[600] text-[#374151]">
        <span className="font-[700]">{integrations.length} total</span>
        <span className="text-[#22C55E]">{activeCount} active</span>
        <span className="text-[#EF4444]">{inactiveCount} inactive</span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {integrations.map((integration) => (
            <ApiIntegrationCard
              key={integration.id}
              integration={integration}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiIntegrationsTab;
