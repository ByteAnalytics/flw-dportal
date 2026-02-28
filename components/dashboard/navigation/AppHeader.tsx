"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants/navigation";
import CustomAvatar from "@/components/ui/custom-avatar";
import { useRouter } from "nextjs-toploader/app";
import { ChevronLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useModelTypeStore } from "@/stores/model-type-store";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { ModelTypeEnum } from "@/types/model-type-store";
import { Button } from "@/components/ui/button";

const MODEL_OPTIONS: ModelTypeEnum[] = Object.values(ModelTypeEnum);

const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const activeItem = navItems.find((item) => pathname === item.url);
  const { user } = useAuthStore((s) => s);
  const { selectedModel, setSelectedModel } = useModelTypeStore();

  return (
    <header className="w-full h-16 md:h-18 bg-[#F3F3F3] border-b border-gray-200 flex items-center pe-4 md:pe-10 md:ps-0 ps-4">
      {activeItem ? (
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
            onClick: () => setSelectedModel(option),
          }))}
        />
      ) : (
        <Link
          href="#"
          onClick={() => router.back()}
          className="me-auto flex items-center justify-center text-sm text-[#667085]"
        >
          <ChevronLeft className="mr-[0.25rem] inline w-4 h-4" />
          Back
        </Link>
      )}

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
