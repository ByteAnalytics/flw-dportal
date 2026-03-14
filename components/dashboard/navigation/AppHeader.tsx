"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import CustomAvatar from "@/components/ui/custom-avatar";
import { useRouter } from "nextjs-toploader/app";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { ModelTypeEnum } from "@/types/model-type-store";
import { Button } from "@/components/ui/button";

const MODEL_OPTIONS: ModelTypeEnum[] = Object.values(ModelTypeEnum);

const CCR_BASE = "/dashboard/ccr";

const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore((s) => s);

  const selectedModel = pathname.startsWith(CCR_BASE)
    ? ModelTypeEnum.CreditRiskRating
    : ModelTypeEnum.ECLGuarantee;

  const handleSelectDropdown = (option: ModelTypeEnum) => {
    if (option === ModelTypeEnum.CreditRiskRating) {
      router.push("/dashboard/ccr/overview");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <header className="w-full h-16 md:h-18 bg-[#F3F3F3] flex items-center pe-4 md:pe-10 md:ps-0 ps-4">
      <CustomDropdown
        className="w-52"
        trigger={
          <div className="p-[1.5px] rounded-md bg-gradient-to-r from-[#49A85ACC] to-[#1E6FB8]">
            <Button className="flex items-center gap-2 text-[13px] font-[600] text-InfraBlack bg-white border-0 w-full h-full">
              {selectedModel}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        }
        items={MODEL_OPTIONS.map((option) => ({
          label: option,
          onClick: () => handleSelectDropdown(option),
        }))}
      />

      <div className="flex items-center gap-6 ml-auto">
        <div
          onClick={() => router.push("/dashboard/profile")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <CustomAvatar
            name={`${user?.first_name} ${user?.last_name}` || "NA"}
            size={36}
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-[#5B5F5E] font-normal">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
